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
var RAGService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAGService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/services/prisma.service");
const axios_1 = require("axios");
const config_1 = require("@nestjs/config");
const fs = require("fs");
let RAGService = RAGService_1 = class RAGService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new common_1.Logger(RAGService_1.name);
        this.qwenApiKey = this.configService.get('QWEN_API_KEY');
        this.qwenBaseUrl = this.configService.get('QWEN_BASE_URL');
    }
    async createKnowledgeBase(userId, createKnowledgeBaseDto) {
        return this.prisma.knowledgeBase.create({
            data: {
                ...createKnowledgeBaseDto,
                userId,
            },
        });
    }
    async findKnowledgeBases(userId) {
        return this.prisma.knowledgeBase.findMany({
            where: { userId },
            include: { documents: { select: { id: true, name: true, size: true, createdAt: true, status: true } } },
        });
    }
    async findKnowledgeBaseById(userId, id) {
        const kb = await this.prisma.knowledgeBase.findUnique({
            where: { id },
            include: { documents: true },
        });
        if (!kb) {
            throw new common_1.NotFoundException('Knowledge base not found');
        }
        if (kb.userId !== userId) {
            throw new common_1.BadRequestException('You do not have permission to access this knowledge base');
        }
        return kb;
    }
    async updateKnowledgeBase(userId, id, updateKnowledgeBaseDto) {
        const kb = await this.findKnowledgeBaseById(userId, id);
        return this.prisma.knowledgeBase.update({
            where: { id },
            data: updateKnowledgeBaseDto,
        });
    }
    async deleteKnowledgeBase(userId, id) {
        await this.findKnowledgeBaseById(userId, id);
        await this.prisma.document.deleteMany({ where: { knowledgeBaseId: id } });
        return this.prisma.knowledgeBase.delete({ where: { id } });
    }
    async uploadDocument(userId, knowledgeBaseId, file) {
        if (!file) {
            throw new common_1.BadRequestException('请选择要上传的文件');
        }
        await this.findKnowledgeBaseById(userId, knowledgeBaseId);
        const mimeType = file.mimetype || 'application/octet-stream';
        const fileName = file.originalname || '';
        const lowerName = fileName.toLowerCase();
        const ext = lowerName.includes('.') ? lowerName.slice(lowerName.lastIndexOf('.')) : '';
        const isTextExt = ['.txt', '.md', '.markdown', '.json', '.csv', '.log', '.yaml', '.yml'].includes(ext);
        const isTextLikeMime = mimeType.startsWith('text/') ||
            mimeType === 'application/json' ||
            mimeType === 'application/xml' ||
            mimeType === 'application/x-yaml' ||
            mimeType === 'application/octet-stream';
        if (!isTextLikeMime && !isTextExt) {
            throw new common_1.BadRequestException('当前仅支持上传 txt / md / json 等文本类文件');
        }
        const contentBuffer = file.buffer ||
            (file.path ? fs.readFileSync(file.path) : undefined);
        if (!contentBuffer) {
            throw new common_1.BadRequestException('读取上传文件失败');
        }
        const content = contentBuffer.toString('utf-8');
        if (!content.trim()) {
            throw new common_1.BadRequestException('文档内容为空或当前格式暂不支持');
        }
        const chunks = await this.processDocumentContent(content);
        const existingDoc = await this.prisma.document.findFirst({
            where: { name: file.originalname, knowledgeBaseId },
        });
        if (existingDoc) {
            throw new common_1.BadRequestException(`该知识库中已存在同名文件「${file.originalname}」，请重命名后重新上传`);
        }
        const document = await this.prisma.document.create({
            data: {
                name: file.originalname,
                content,
                mimeType,
                size: file.size || contentBuffer.length,
                status: 'completed',
                knowledgeBaseId,
            },
        });
        await this.saveDocumentChunks(document.id, chunks);
        return document;
    }
    async getDocumentChunks(userId, documentId) {
        const document = await this.prisma.document.findUnique({
            where: { id: documentId },
            include: { knowledgeBase: true },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        if (document.knowledgeBase.userId !== userId) {
            throw new common_1.BadRequestException('You do not have permission to access this document');
        }
        const chunks = await this.prisma.documentChunk.findMany({
            where: { documentId },
            orderBy: { chunkIndex: 'asc' },
            select: {
                id: true,
                content: true,
                chunkIndex: true,
                startIndex: true,
                endIndex: true,
                metadata: true,
                createdAt: true,
            },
        });
        return {
            documentId,
            documentName: document.name,
            totalChunks: chunks.length,
            chunks,
        };
    }
    async deleteDocument(userId, documentId) {
        const document = await this.prisma.document.findUnique({
            where: { id: documentId },
            include: { knowledgeBase: true },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        if (document.knowledgeBase.userId !== userId) {
            throw new common_1.BadRequestException('You do not have permission to delete this document');
        }
        await this.prisma.documentChunk.deleteMany({ where: { documentId } });
        return this.prisma.document.delete({ where: { id: documentId } });
    }
    async retrieve(query, knowledgeBaseId, topK = 5) {
        const queryVector = await this.generateEmbedding(query);
        const allChunks = await this.prisma.documentChunk.findMany({
            where: {
                document: {
                    knowledgeBaseId: knowledgeBaseId
                }
            },
            include: {
                document: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        const scoredChunks = allChunks.map(chunk => {
            const chunkEmbedding = JSON.parse(chunk.embedding || '[]');
            const similarity = this.cosineSimilarity(queryVector, chunkEmbedding);
            return {
                id: chunk.id,
                content: chunk.content,
                documentId: chunk.documentId,
                documentName: chunk.document.name,
                similarity
            };
        });
        return scoredChunks
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK);
    }
    cosineSimilarity(vecA, vecB) {
        if (vecA.length !== vecB.length || vecA.length === 0)
            return 0;
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
        return isNaN(similarity) ? 0 : similarity;
    }
    async processDocumentContent(content) {
        const chunks = this.splitText(content, 2000, 200).slice(0, 5);
        const chunksWithEmbeddings = await Promise.all(chunks.map(async (chunk) => {
            const embedding = await this.generateEmbedding(chunk);
            return { content: chunk, embedding };
        }));
        return chunksWithEmbeddings;
    }
    splitText(text, chunkSize, overlap) {
        const chunks = [];
        let start = 0;
        while (start < text.length) {
            const end = Math.min(start + chunkSize, text.length);
            chunks.push(text.substring(start, end));
            start += chunkSize - overlap;
        }
        return chunks;
    }
    async generateEmbedding(text) {
        if (!this.qwenApiKey || this.qwenApiKey === 'your-qwen-api-key-here') {
            return [];
        }
        try {
            const response = await axios_1.default.post(`${this.qwenBaseUrl}/embeddings`, {
                model: 'text-embedding-v3',
                input: text,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.qwenApiKey}`,
                },
            });
            return response.data.data[0].embedding;
        }
        catch (error) {
            this.logger.warn(`Embedding generation failed: ${error instanceof Error ? error.message : error}`);
            return [];
        }
    }
    async saveDocumentChunks(documentId, chunks) {
        const document = await this.prisma.document.findUnique({ where: { id: documentId } });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        await this.prisma.documentChunk.createMany({
            data: chunks.map((chunk, index) => ({
                documentId,
                content: chunk.content,
                embedding: JSON.stringify(chunk.embedding),
                chunkIndex: index,
                startIndex: 0,
                endIndex: chunk.content.length,
            })),
        });
    }
};
exports.RAGService = RAGService;
exports.RAGService = RAGService = RAGService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], RAGService);
//# sourceMappingURL=rag.service.js.map