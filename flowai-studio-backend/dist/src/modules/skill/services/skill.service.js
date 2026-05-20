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
const prisma_service_1 = require("../../../common/services/prisma.service");
const builtin_skills_1 = require("../utils/builtin-skills");
const axios_1 = require("axios");
let SkillService = class SkillService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSkill(userId, createSkillDto) {
        const existingSkill = await this.prisma.skill.findFirst({
            where: { name: createSkillDto.name, userId },
        });
        if (existingSkill) {
            throw new common_1.BadRequestException('Skill with this name already exists');
        }
        return this.prisma.skill.create({
            data: {
                name: createSkillDto.name,
                description: createSkillDto.description,
                type: createSkillDto.type,
                builtinType: createSkillDto.builtinType,
                isActive: createSkillDto.isActive,
                userId,
                config: createSkillDto.config ? JSON.stringify(createSkillDto.config) : undefined,
                inputSchema: createSkillDto.inputSchema ? JSON.stringify(createSkillDto.inputSchema) : undefined,
                outputSchema: createSkillDto.outputSchema ? JSON.stringify(createSkillDto.outputSchema) : undefined,
            },
        });
    }
    async findSkills(userId) {
        return this.prisma.skill.findMany({
            where: { userId },
        });
    }
    async findSkillById(userId, id) {
        const skill = await this.prisma.skill.findUnique({
            where: { id },
        });
        if (!skill) {
            throw new common_1.NotFoundException('Skill not found');
        }
        if (skill.userId !== userId) {
            throw new common_1.BadRequestException('You do not have permission to access this skill');
        }
        return skill;
    }
    async updateSkill(userId, id, updateSkillDto) {
        const skill = await this.findSkillById(userId, id);
        return this.prisma.skill.update({
            where: { id },
            data: {
                name: updateSkillDto.name,
                description: updateSkillDto.description,
                type: updateSkillDto.type,
                builtinType: updateSkillDto.builtinType,
                isActive: updateSkillDto.isActive,
                config: updateSkillDto.config ? JSON.stringify(updateSkillDto.config) : undefined,
                inputSchema: updateSkillDto.inputSchema ? JSON.stringify(updateSkillDto.inputSchema) : undefined,
                outputSchema: updateSkillDto.outputSchema ? JSON.stringify(updateSkillDto.outputSchema) : undefined,
            },
        });
    }
    async deleteSkill(userId, id) {
        const skill = await this.findSkillById(userId, id);
        return this.prisma.skill.delete({ where: { id } });
    }
    async executeSkill(skillId, params) {
        const skill = await this.prisma.skill.findUnique({
            where: { id: skillId },
        });
        if (!skill) {
            throw new common_1.NotFoundException('Skill not found');
        }
        if (!skill.isActive) {
            throw new common_1.BadRequestException('Skill is not active');
        }
        if (skill.type === 'builtin') {
            return (0, builtin_skills_1.executeBuiltinSkill)(skill.builtinType, params);
        }
        else {
            return this.executeCustomSkill(skill, params);
        }
    }
    async executeCustomSkill(skill, params) {
        const config = JSON.parse(skill.config || '{}');
        const { url, method = 'POST', headers = {} } = config;
        if (!url) {
            return {
                success: true,
                data: params,
                message: 'Custom skill executed (Echo mode, no URL configured)',
            };
        }
        try {
            const response = await (0, axios_1.default)({
                url,
                method,
                headers,
                data: params,
            });
            return {
                success: true,
                data: response.data,
            };
        }
        catch (error) {
            throw new Error(`Custom skill execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getBuiltinSkills() {
        return [
            {
                type: 'time',
                name: '时间工具',
                description: '获取当前时间和日期',
                inputSchema: {},
                outputSchema: {
                    datetime: 'string',
                    timestamp: 'number',
                    date: 'string',
                    time: 'string',
                },
            },
            {
                type: 'http',
                name: 'HTTP请求',
                description: '发送HTTP请求',
                inputSchema: {
                    url: 'string',
                    method: 'string',
                    headers: 'object',
                    body: 'object',
                },
                outputSchema: {
                    status: 'number',
                    data: 'any',
                    headers: 'object',
                },
            },
            {
                type: 'json',
                name: 'JSON处理',
                description: '解析或生成JSON',
                inputSchema: {
                    action: 'string',
                    data: 'any',
                },
                outputSchema: {
                    result: 'any',
                },
            },
            {
                type: 'regex',
                name: '正则表达式',
                description: '使用正则表达式匹配文本',
                inputSchema: {
                    text: 'string',
                    pattern: 'string',
                    flags: 'string',
                },
                outputSchema: {
                    matches: 'array',
                    groups: 'object',
                },
            },
        ];
    }
};
exports.SkillService = SkillService;
exports.SkillService = SkillService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SkillService);
//# sourceMappingURL=skill.service.js.map