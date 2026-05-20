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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMNodeExecutor = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../../../ai/ai.service");
let LLMNodeExecutor = class LLMNodeExecutor {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async execute(node, context) {
        const nodeData = node.data;
        const { model, systemPrompt, userPrompt, temperature, maxTokens } = nodeData;
        const resolvedUserPrompt = this.resolveVariables(userPrompt, context);
        const response = await this.aiService.chatWithLLM(resolvedUserPrompt, systemPrompt, [], model, temperature, maxTokens);
        return { result: response };
    }
    resolveVariables(template, context) {
        return template.replace(/\{\{(.+?)\}\}/g, (match, p1) => {
            const keys = p1.trim().split('.');
            let value = context;
            for (const key of keys) {
                if (value && typeof value === 'object' && key in value) {
                    value = value[key];
                }
                else {
                    return match;
                }
            }
            return typeof value === 'object' ? JSON.stringify(value) : String(value);
        });
    }
};
exports.LLMNodeExecutor = LLMNodeExecutor;
exports.LLMNodeExecutor = LLMNodeExecutor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], LLMNodeExecutor);
//# sourceMappingURL=llm-node.executor.js.map