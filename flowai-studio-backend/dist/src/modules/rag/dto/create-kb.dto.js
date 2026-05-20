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
exports.CreateKnowledgeBaseDto = void 0;
const class_validator_1 = require("class-validator");
class CreateKnowledgeBaseDto {
}
exports.CreateKnowledgeBaseDto = CreateKnowledgeBaseDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Name must be a string' }),
    __metadata("design:type", String)
], CreateKnowledgeBaseDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    __metadata("design:type", String)
], CreateKnowledgeBaseDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Embedding model must be a string' }),
    (0, class_validator_1.IsIn)(['text-embedding-v1', 'text-embedding-v2', 'text-embedding-v3'], {
        message: 'Invalid embedding model',
    }),
    __metadata("design:type", String)
], CreateKnowledgeBaseDto.prototype, "embeddingModel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Chunk size must be a number' }),
    (0, class_validator_1.Min)(100, { message: 'Chunk size must be at least 100' }),
    (0, class_validator_1.Max)(2000, { message: 'Chunk size must not exceed 2000' }),
    __metadata("design:type", Number)
], CreateKnowledgeBaseDto.prototype, "chunkSize", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Chunk overlap must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Chunk overlap must be at least 0' }),
    (0, class_validator_1.Max)(500, { message: 'Chunk overlap must not exceed 500' }),
    __metadata("design:type", Number)
], CreateKnowledgeBaseDto.prototype, "chunkOverlap", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'TopK must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'TopK must be at least 1' }),
    (0, class_validator_1.Max)(20, { message: 'TopK must not exceed 20' }),
    __metadata("design:type", Number)
], CreateKnowledgeBaseDto.prototype, "topK", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Similarity threshold must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Similarity threshold must be at least 0' }),
    (0, class_validator_1.Max)(1, { message: 'Similarity threshold must not exceed 1' }),
    __metadata("design:type", Number)
], CreateKnowledgeBaseDto.prototype, "similarityThreshold", void 0);
//# sourceMappingURL=create-kb.dto.js.map