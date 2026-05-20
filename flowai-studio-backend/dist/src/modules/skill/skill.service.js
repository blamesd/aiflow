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
exports.SkillService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/services/prisma.service");
const BUILTIN_SKILLS = [
    {
        id: 'builtin-time',
        name: '获取当前时间',
        description: '获取当前的日期和时间信息',
        type: 'builtin',
        builtinType: 'time',
        inputSchema: {},
        outputSchema: {
            type: 'object',
            properties: {
                datetime: { type: 'string', description: '当前日期时间' },
                timestamp: { type: 'number', description: '时间戳' },
            },
        },
    },
    {
        id: 'builtin-http',
        name: 'HTTP请求',
        description: '发送HTTP请求到指定URL',
        type: 'builtin',
        builtinType: 'http',
        inputSchema: {
            type: 'object',
            properties: {
                url: { type: 'string', description: '请求URL' },
                method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE'], description: '请求方法' },
                headers: { type: 'object', description: '请求头' },
                body: { type: 'object', description: '请求体' },
            },
            required: ['url', 'method'],
        },
        outputSchema: {
            type: 'object',
            properties: {
                status: { type: 'number', description: 'HTTP状态码' },
                data: { type: 'object', description: '响应数据' },
                headers: { type: 'object', description: '响应头' },
            },
        },
    },
    {
        id: 'builtin-json',
        name: 'JSON解析',
        description: '解析或序列化JSON数据',
        type: 'builtin',
        builtinType: 'json',
        inputSchema: {
            type: 'object',
            properties: {
                action: { type: 'string', enum: ['parse', 'stringify'], description: '操作类型' },
                data: { type: 'string', description: '要解析的JSON字符串' },
                value: { type: 'object', description: '要序列化的对象' },
            },
            required: ['action'],
        },
        outputSchema: {
            type: 'object',
            properties: {
                result: { type: 'object', description: '解析结果或序列化后的字符串' },
            },
        },
    },
    {
        id: 'builtin-regex',
        name: '正则匹配',
        description: '使用正则表达式匹配文本',
        type: 'builtin',
        builtinType: 'regex',
        inputSchema: {
            type: 'object',
            properties: {
                text: { type: 'string', description: '要匹配的文本' },
                pattern: { type: 'string', description: '正则表达式' },
                flags: { type: 'string', description: '正则标志' },
            },
            required: ['text', 'pattern'],
        },
        outputSchema: {
            type: 'object',
            properties: {
                matches: { type: 'array', description: '匹配结果' },
                groups: { type: 'object', description: '捕获组' },
            },
        },
    },
];
let SkillService = class SkillService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createSkillDto) {
        return this.prisma.skill.create({
            data: {
                ...createSkillDto,
                userId,
                type: 'custom',
                config: createSkillDto.config ? JSON.stringify(createSkillDto.config) : undefined,
                inputSchema: createSkillDto.inputSchema ? JSON.stringify(createSkillDto.inputSchema) : undefined,
                outputSchema: createSkillDto.outputSchema ? JSON.stringify(createSkillDto.outputSchema) : undefined,
            },
            select: {
                id: true,
                name: true,
                description: true,
                type: true,
                config: true,
                inputSchema: true,
                outputSchema: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.skill.findMany({
            where: { userId, type: 'custom' },
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                name: true,
                description: true,
                type: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    getBuiltinSkills() {
        return BUILTIN_SKILLS;
    }
    async findOne(userId, id) {
        const skill = await this.prisma.skill.findUnique({
            where: { id },
        });
        if (!skill) {
            throw new common_1.NotFoundException('Skill not found');
        }
        if (skill.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this skill');
        }
        return skill;
    }
    async update(userId, id, updateSkillDto) {
        const skill = await this.prisma.skill.findUnique({
            where: { id },
        });
        if (!skill) {
            throw new common_1.NotFoundException('Skill not found');
        }
        if (skill.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to update this skill');
        }
        if (skill.type === 'builtin') {
            throw new common_1.ForbiddenException('Cannot modify builtin skills');
        }
        return this.prisma.skill.update({
            where: { id },
            data: {
                ...updateSkillDto,
                config: updateSkillDto.config ? JSON.stringify(updateSkillDto.config) : undefined,
                inputSchema: updateSkillDto.inputSchema ? JSON.stringify(updateSkillDto.inputSchema) : undefined,
                outputSchema: updateSkillDto.outputSchema ? JSON.stringify(updateSkillDto.outputSchema) : undefined,
            },
            select: {
                id: true,
                name: true,
                description: true,
                type: true,
                config: true,
                inputSchema: true,
                outputSchema: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async remove(userId, id) {
        const skill = await this.prisma.skill.findUnique({
            where: { id },
        });
        if (!skill) {
            throw new common_1.NotFoundException('Skill not found');
        }
        if (skill.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to delete this skill');
        }
        if (skill.type === 'builtin') {
            throw new common_1.ForbiddenException('Cannot delete builtin skills');
        }
        await this.prisma.skill.delete({
            where: { id },
        });
        return { success: true };
    }
};
exports.SkillService = SkillService;
exports.SkillService = SkillService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SkillService);
//# sourceMappingURL=skill.service.js.map