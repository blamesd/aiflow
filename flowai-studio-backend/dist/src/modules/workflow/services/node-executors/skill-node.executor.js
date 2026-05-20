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
exports.SkillNodeExecutor = void 0;
const common_1 = require("@nestjs/common");
const skill_service_1 = require("../../../skill/services/skill.service");
let SkillNodeExecutor = class SkillNodeExecutor {
    constructor(skillService) {
        this.skillService = skillService;
    }
    async execute(node, context) {
        const nodeData = node.data;
        const { skillId, parameters } = nodeData;
        const resolvedParams = this.resolveParameters(parameters, context);
        const result = await this.skillService.executeSkill(skillId, resolvedParams);
        return { result };
    }
    resolveParameters(params, context) {
        const resolvedParams = {};
        if (!params)
            return resolvedParams;
        for (const key in params) {
            const value = params[key];
            if (typeof value === 'string') {
                resolvedParams[key] = this.resolveVariables(value, context);
            }
            else {
                resolvedParams[key] = value;
            }
        }
        return resolvedParams;
    }
    resolveVariables(template, context) {
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
exports.SkillNodeExecutor = SkillNodeExecutor;
exports.SkillNodeExecutor = SkillNodeExecutor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [skill_service_1.SkillService])
], SkillNodeExecutor);
//# sourceMappingURL=skill-node.executor.js.map