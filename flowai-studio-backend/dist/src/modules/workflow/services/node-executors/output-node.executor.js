"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputNodeExecutor = void 0;
const common_1 = require("@nestjs/common");
let OutputNodeExecutor = class OutputNodeExecutor {
    async execute(node, context) {
        const nodeData = node.data;
        const { outputValue } = nodeData;
        const resolvedOutput = this.resolveVariables(outputValue, context);
        return { finalOutput: resolvedOutput };
    }
    resolveVariables(template, context) {
        if (typeof template !== 'string') {
            return template;
        }
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
exports.OutputNodeExecutor = OutputNodeExecutor;
exports.OutputNodeExecutor = OutputNodeExecutor = __decorate([
    (0, common_1.Injectable)()
], OutputNodeExecutor);
//# sourceMappingURL=output-node.executor.js.map