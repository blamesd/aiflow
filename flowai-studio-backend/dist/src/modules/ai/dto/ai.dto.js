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
exports.ChatDto = exports.StreamRunDto = exports.RunDto = void 0;
const class_validator_1 = require("class-validator");
class RunDto {
}
exports.RunDto = RunDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'Invalid application ID' }),
    __metadata("design:type", String)
], RunDto.prototype, "appId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'Invalid workflow ID' }),
    __metadata("design:type", String)
], RunDto.prototype, "workflowId", void 0);
__decorate([
    (0, class_validator_1.IsObject)({ message: 'Inputs must be an object' }),
    __metadata("design:type", Object)
], RunDto.prototype, "inputs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Session ID must be a string' }),
    __metadata("design:type", String)
], RunDto.prototype, "sessionId", void 0);
class StreamRunDto extends RunDto {
}
exports.StreamRunDto = StreamRunDto;
class ChatDto {
}
exports.ChatDto = ChatDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Message must be a string' }),
    __metadata("design:type", String)
], ChatDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'History must be an array' }),
    __metadata("design:type", Array)
], ChatDto.prototype, "history", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Session ID must be a string' }),
    __metadata("design:type", String)
], ChatDto.prototype, "sessionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'Invalid knowledge base ID' }),
    __metadata("design:type", String)
], ChatDto.prototype, "knowledgeBaseId", void 0);
//# sourceMappingURL=ai.dto.js.map