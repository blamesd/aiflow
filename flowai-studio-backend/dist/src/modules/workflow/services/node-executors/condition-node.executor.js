"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionNodeExecutor = void 0;
const common_1 = require("@nestjs/common");
let ConditionNodeExecutor = class ConditionNodeExecutor {
    async execute(node, context) {
        const nodeData = node.data;
        const { conditions } = nodeData;
        let result = true;
        if (conditions && Array.isArray(conditions)) {
            for (const condition of conditions) {
                const { variable, operator, value } = condition;
                const contextValue = this.resolveVariable(variable, context);
                if (!this.evaluate(contextValue, operator, value)) {
                    result = false;
                    break;
                }
            }
        }
        return { result };
    }
    resolveVariable(template, context) {
        if (!template)
            return undefined;
        const keys = template.replace(/\{\{|\}\}/g, '').trim().split('.');
        let value = context;
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            }
            else {
                return undefined;
            }
        }
        return value;
    }
    evaluate(contextValue, operator, value) {
        switch (operator) {
            case '===':
                return contextValue === value;
            case '!==':
                return contextValue !== value;
            case '>':
                return contextValue > value;
            case '<':
                return contextValue < value;
            case '>=':
                return contextValue >= value;
            case '<=':
                return contextValue <= value;
            case 'contains':
                return typeof contextValue === 'string' && contextValue.includes(value);
            default:
                return false;
        }
    }
};
exports.ConditionNodeExecutor = ConditionNodeExecutor;
exports.ConditionNodeExecutor = ConditionNodeExecutor = __decorate([
    (0, common_1.Injectable)()
], ConditionNodeExecutor);
//# sourceMappingURL=condition-node.executor.js.map