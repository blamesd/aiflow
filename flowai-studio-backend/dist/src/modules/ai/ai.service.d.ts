import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/services/prisma.service';
import { StreamRunDto, RunDto, ChatDto } from './dto/ai.dto';
import { RAGService } from '../rag/services/rag.service';
import { WorkflowExecutorService } from '../workflow/services/workflow-executor.service';
export declare class AiService {
    private prisma;
    private configService;
    private ragService;
    private workflowExecutor;
    constructor(prisma: PrismaService, configService: ConfigService, ragService: RAGService, workflowExecutor: WorkflowExecutorService);
    run(userId: string, runDto: RunDto): Promise<{
        success: boolean;
        message: string;
        data: {
            output: any;
            context: Record<string, any>;
        };
    }>;
    streamRun(userId: string, streamRunDto: StreamRunDto, res: Response): Promise<void>;
    private resolveWorkflowId;
    private extractOutputFromContext;
    chat(userId: string, chatDto: ChatDto, res: Response): Promise<void>;
    chatWithLLM(userPrompt: string, systemPrompt?: string, history?: any[], model?: string, temperature?: number, maxTokens?: number): Promise<string>;
    getChatHistory(userId: string, sessionId: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        role: string;
        references: string | null;
        toolCalls: string | null;
    }[]>;
    getAllChatHistories(userId: string, appId?: string): Promise<{
        sessionId: any;
        lastMessageAt: any;
    }[]>;
}
