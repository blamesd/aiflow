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
exports.McpService = void 0;
const common_1 = require("@nestjs/common");
let McpService = class McpService {
    constructor() {
        this.tools = new Map();
        this.registerBuiltinTools();
    }
    registerBuiltinTools() {
        this.tools.set('echo', {
            name: 'echo',
            description: '回显输入的消息',
            inputSchema: {
                type: 'object',
                properties: {
                    message: { type: 'string', description: '要回显的消息' }
                },
                required: ['message']
            },
            handler: async (params) => {
                return { message: params.message };
            },
        });
        this.tools.set('calculator', {
            name: 'calculator',
            description: '执行基础算术运算',
            inputSchema: {
                type: 'object',
                properties: {
                    a: { type: 'number', description: '第一个操作数' },
                    b: { type: 'number', description: '第二个操作数' },
                    operation: {
                        type: 'string',
                        enum: ['add', 'subtract', 'multiply', 'divide'],
                        description: '运算符'
                    }
                },
                required: ['a', 'b', 'operation']
            },
            handler: async (params) => {
                const { a, b, operation } = params;
                let result;
                switch (operation) {
                    case 'add':
                        result = a + b;
                        break;
                    case 'subtract':
                        result = a - b;
                        break;
                    case 'multiply':
                        result = a * b;
                        break;
                    case 'divide':
                        if (b === 0)
                            throw new Error('Cannot divide by zero');
                        result = a / b;
                        break;
                    default:
                        throw new Error(`Unknown operation: ${operation}`);
                }
                return { result };
            },
        });
    }
    async getTools() {
        return Array.from(this.tools.values()).map((tool) => ({
            name: tool.name,
            description: tool.description,
            inputSchema: tool.inputSchema,
        }));
    }
    async invokeTool(userId, toolName, params) {
        const tool = this.tools.get(toolName);
        if (!tool) {
            throw new common_1.NotFoundException(`Tool ${toolName} not found`);
        }
        try {
            const result = await tool.handler(params);
            return {
                success: true,
                tool: toolName,
                result,
            };
        }
        catch (error) {
            return {
                success: false,
                tool: toolName,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
};
exports.McpService = McpService;
exports.McpService = McpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], McpService);
//# sourceMappingURL=mcp.service.js.map