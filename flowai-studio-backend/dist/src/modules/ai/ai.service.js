"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../common/services/prisma.service");
const rag_service_1 = require("../rag/services/rag.service");
const workflow_executor_service_1 = require("../workflow/services/workflow-executor.service");
const rxjs_1 = require("rxjs");
const axios_1 = require("axios");
let AiService = class AiService {
    constructor(prisma, configService, ragService, workflowExecutor) {
        this.prisma = prisma;
        this.configService = configService;
        this.ragService = ragService;
        this.workflowExecutor = workflowExecutor;
    }
    async run(userId, runDto) {
        const workflowId = await this.resolveWorkflowId(userId, runDto.appId, runDto.workflowId);
        const result = await this.workflowExecutor.executeWorkflow(workflowId, {
            inputs: runDto.inputs,
            sessionId: runDto.sessionId,
        });
        const outputResult = this.extractOutputFromContext(result);
        return {
            success: true,
            message: 'Workflow execution completed',
            data: {
                output: outputResult,
                context: result,
            },
        };
    }
    async streamRun(userId, streamRunDto, res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        try {
            const workflowId = await this.resolveWorkflowId(userId, streamRunDto.appId, streamRunDto.workflowId);
            const sseSubject = new rxjs_1.Subject();
            sseSubject.subscribe({
                next: (event) => {
                    res.write(`data: ${JSON.stringify(event)}\n\n`);
                },
                complete: () => {
                    res.end();
                },
                error: (err) => {
                    res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
                    res.end();
                },
            });
            await this.workflowExecutor.executeWorkflow(workflowId, {
                inputs: streamRunDto.inputs,
                sessionId: streamRunDto.sessionId,
            }, sseSubject);
            sseSubject.complete();
        }
        catch (error) {
            res.write(`data: ${JSON.stringify({ type: 'error', message: error instanceof Error ? error.message : 'Unknown error' })}\n\n`);
            res.end();
        }
    }
    async resolveWorkflowId(userId, appId, workflowId) {
        if (workflowId) {
            return workflowId;
        }
        const app = await this.prisma.application.findUnique({
            where: { id: appId },
        });
        if (!app) {
            throw new Error('Application not found');
        }
        if (app.userId !== userId) {
            throw new Error('You do not have permission to run this application');
        }
        const workflow = await this.prisma.workflow.findFirst({
            where: { applicationId: appId },
            orderBy: { updatedAt: 'desc' },
            select: { id: true },
        });
        if (!workflow) {
            throw new Error('No workflow found for this application. Please create a workflow first.');
        }
        return workflow.id;
    }
    extractOutputFromContext(context) {
        for (const [, value] of Object.entries(context)) {
            if (value && typeof value === 'object' && 'result' in value) {
                continue;
            }
        }
        return context;
    }
    async chat(userId, chatDto, res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        try {
            const { message, history = [], sessionId = Date.now().toString(), knowledgeBaseId } = chatDto;
            const apiKey = this.configService.get('QWEN_API_KEY');
            const baseUrl = this.configService.get('QWEN_BASE_URL');
            this.prisma.chatHistory.create({
                data: { sessionId, role: 'user', content: message, userId },
            }).catch((e) => console.error('保存用户消息失败:', e.message));
            let context = '';
            let references = [];
            if (knowledgeBaseId) {
                try {
                    references = await this.ragService.retrieve(message, knowledgeBaseId, 5);
                    context = references.map((ref) => ref.content).join('\n\n');
                }
                catch (ragError) {
                    console.error('RAG 检索失败，降级为普通对话:', ragError.message);
                }
            }
            const messages = [];
            if (context) {
                messages.push({
                    role: 'system',
                    content: `你是一个基于知识库回答问题的助手。请参考以下内容回答：\n\n${context}`,
                });
            }
            messages.push(...history);
            messages.push({ role: 'user', content: message });
            const response = await axios_1.default.post(`${baseUrl}/chat/completions`, { model: 'qwen-turbo', messages, stream: true }, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                responseType: 'stream',
                timeout: 30000,
            });
            let fullAssistantContent = '';
            response.data.on('data', (chunk) => {
                const lines = chunk.toString().split('\n').filter((line) => line.trim() !== '');
                for (const line of lines) {
                    if (line.includes('[DONE]'))
                        continue;
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            const content = data.choices[0]?.delta?.content || '';
                            if (content) {
                                fullAssistantContent += content;
                                res.write(`data: ${JSON.stringify({ type: 'text', content })}\n\n`);
                            }
                        }
                        catch {
                        }
                    }
                }
            });
            response.data.on('end', async () => {
                this.prisma.chatHistory.create({
                    data: {
                        sessionId,
                        role: 'assistant',
                        content: fullAssistantContent,
                        userId,
                        references: JSON.stringify(references),
                    },
                }).catch((e) => console.error('保存助手消息失败:', e.message));
                res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
                res.end();
            });
            response.data.on('error', (err) => {
                console.error('Qwen 流式响应错误:', err.message);
                const safeMsg = (err.message || '流式响应异常').replace(/[\n\r]/g, ' ');
                res.write(`data: ${JSON.stringify({ type: 'error', message: safeMsg })}\n\n`);
                res.end();
            });
        }
        catch (error) {
            console.error('Chat error:', error);
            const safeMsg = (error instanceof Error ? error.message : 'Unknown error').replace(/[\n\r]/g, ' ');
            res.write(`data: ${JSON.stringify({ type: 'error', message: safeMsg })}\n\n`);
            res.end();
        }
    }
    async chatWithLLM(userPrompt, systemPrompt, history = [], model = 'qwen-turbo', temperature = 0.7, maxTokens = 2048) {
        const apiKey = this.configService.get('QWEN_API_KEY');
        const baseUrl = this.configService.get('QWEN_BASE_URL');
        const messages = [];
        if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt });
        }
        messages.push(...history);
        messages.push({ role: 'user', content: userPrompt });
        try {
            const response = await axios_1.default.post(`${baseUrl}/chat/completions`, {
                model,
                messages,
                temperature,
                max_tokens: maxTokens,
            }, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data.choices[0].message.content;
        }
        catch (error) {
            console.error('Error calling LLM API:', error.response?.data || error.message);
            throw new Error('Failed to get response from LLM.');
        }
    }
    async getChatHistory(userId, sessionId) {
        return this.prisma.chatHistory.findMany({
            where: {
                sessionId,
                userId,
            },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                role: true,
                content: true,
                references: true,
                toolCalls: true,
                createdAt: true,
            },
        });
    }
    async getAllChatHistories(userId, appId) {
        const where = { userId };
        if (appId) {
            where.metadata = { path: ['appId'], equals: appId };
        }
        const histories = await this.prisma.chatHistory.groupBy({
            by: ['sessionId'],
            where,
            _max: {
                createdAt: true,
            },
        });
        return histories.map((h) => ({
            sessionId: h.sessionId,
            lastMessageAt: h._max.createdAt,
        }));
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => workflow_executor_service_1.WorkflowExecutorService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        rag_service_1.RAGService,
        workflow_executor_service_1.WorkflowExecutorService])
], AiService);
//# sourceMappingURL=ai.service.js.map