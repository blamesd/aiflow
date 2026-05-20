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
exports.RAGNodeExecutor = void 0;
const common_1 = require("@nestjs/common");
const rag_service_1 = require("../../../rag/services/rag.service");
let RAGNodeExecutor = class RAGNodeExecutor {
    constructor(ragService) {
        this.ragService = ragService;
    }
    async execute(node, context) {
        const nodeData = node.data;
        const { knowledgeBaseId, query, topK, similarityThreshold } = nodeData;
        const resolvedQuery = this.resolveVariables(query, context);
        const documents = await this.ragService.retrieve(resolvedQuery, knowledgeBaseId, topK);
        return { documents };
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
exports.RAGNodeExecutor = RAGNodeExecutor;
exports.RAGNodeExecutor = RAGNodeExecutor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rag_service_1.RAGService])
], RAGNodeExecutor);
//# sourceMappingURL=rag-node.executor.js.map