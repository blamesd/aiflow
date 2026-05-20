"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateKnowledgeBaseDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_kb_dto_1 = require("./create-kb.dto");
class UpdateKnowledgeBaseDto extends (0, mapped_types_1.PartialType)(create_kb_dto_1.CreateKnowledgeBaseDto) {
}
exports.UpdateKnowledgeBaseDto = UpdateKnowledgeBaseDto;
//# sourceMappingURL=update-kb.dto.js.map