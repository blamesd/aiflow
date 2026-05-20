"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInputNodeExecutor = void 0;
const common_1 = require("@nestjs/common");
let UserInputNodeExecutor = class UserInputNodeExecutor {
    async execute(node, context) {
        const nodeData = node.data;
        const { inputField } = nodeData;
        const inputValue = context[inputField];
        if (inputValue === undefined) {
            throw new Error(`Missing required user input for field: ${inputField}`);
        }
        return { [inputField]: inputValue };
    }
};
exports.UserInputNodeExecutor = UserInputNodeExecutor;
exports.UserInputNodeExecutor = UserInputNodeExecutor = __decorate([
    (0, common_1.Injectable)()
], UserInputNodeExecutor);
//# sourceMappingURL=user-input-node.executor.js.map