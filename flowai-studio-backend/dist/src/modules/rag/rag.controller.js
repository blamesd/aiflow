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
exports.RAGController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const rag_service_1 = require("./services/rag.service");
const create_knowledge_base_dto_1 = require("./dto/create-knowledge-base.dto");
const update_knowledge_base_dto_1 = require("./dto/update-knowledge-base.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let RAGController = class RAGController {
    constructor(ragService) {
        this.ragService = ragService;
    }
    createKnowledgeBase(userId, createKnowledgeBaseDto) {
        return this.ragService.createKnowledgeBase(userId, createKnowledgeBaseDto);
    }
    findKnowledgeBases(userId) {
        return this.ragService.findKnowledgeBases(userId);
    }
    findKnowledgeBaseById(userId, id) {
        return this.ragService.findKnowledgeBaseById(userId, id);
    }
    updateKnowledgeBase(userId, id, updateKnowledgeBaseDto) {
        return this.ragService.updateKnowledgeBase(userId, id, updateKnowledgeBaseDto);
    }
    deleteKnowledgeBase(userId, id) {
        return this.ragService.deleteKnowledgeBase(userId, id);
    }
    uploadDocument(userId, knowledgeBaseId, file) {
        return this.ragService.uploadDocument(userId, knowledgeBaseId, file);
    }
    getDocumentChunks(userId, documentId) {
        return this.ragService.getDocumentChunks(userId, documentId);
    }
    deleteDocument(userId, documentId) {
        return this.ragService.deleteDocument(userId, documentId);
    }
    retrieve(query, knowledgeBaseId, topK = 5) {
        return this.ragService.retrieve(query, knowledgeBaseId, topK);
    }
};
exports.RAGController = RAGController;
__decorate([
    (0, common_1.Post)('knowledge-bases'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_knowledge_base_dto_1.CreateKnowledgeBaseDto]),
    __metadata("design:returntype", void 0)
], RAGController.prototype, "createKnowledgeBase", null);
__decorate([
    (0, common_1.Get)('knowledge-bases'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RAGController.prototype, "findKnowledgeBases", null);
__decorate([
    (0, common_1.Get)('knowledge-bases/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RAGController.prototype, "findKnowledgeBaseById", null);
__decorate([
    (0, common_1.Patch)('knowledge-bases/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_knowledge_base_dto_1.UpdateKnowledgeBaseDto]),
    __metadata("design:returntype", void 0)
], RAGController.prototype, "updateKnowledgeBase", null);
__decorate([
    (0, common_1.Delete)('knowledge-bases/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RAGController.prototype, "deleteKnowledgeBase", null);
__decorate([
    (0, common_1.Post)('documents/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Body)('knowledgeBaseId')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], RAGController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Get)('documents/:documentId/chunks'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RAGController.prototype, "getDocumentChunks", null);
__decorate([
    (0, common_1.Delete)('documents/:documentId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RAGController.prototype, "deleteDocument", null);
__decorate([
    (0, common_1.Post)('retrieve'),
    __param(0, (0, common_1.Body)('query')),
    __param(1, (0, common_1.Body)('knowledgeBaseId')),
    __param(2, (0, common_1.Body)('topK')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", void 0)
], RAGController.prototype, "retrieve", null);
exports.RAGController = RAGController = __decorate([
    (0, common_1.Controller)('rag'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [rag_service_1.RAGService])
], RAGController);
//# sourceMappingURL=rag.controller.js.map