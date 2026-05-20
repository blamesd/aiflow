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
exports.WorkflowService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/services/prisma.service");
let WorkflowService = class WorkflowService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    serializeWorkflow(workflow) {
        return {
            ...workflow,
            nodes: this.parseJsonField(workflow.nodes, []),
            edges: this.parseJsonField(workflow.edges, []),
            variables: workflow.variables
                ? this.parseJsonField(workflow.variables, {})
                : null,
        };
    }
    parseJsonField(value, fallback) {
        try {
            return JSON.parse(value);
        }
        catch {
            return fallback;
        }
    }
    async create(userId, createWorkflowDto) {
        const { applicationId, ...data } = createWorkflowDto;
        const app = await this.prisma.application.findUnique({
            where: { id: applicationId },
        });
        if (!app) {
            throw new common_1.NotFoundException('Application not found');
        }
        if (app.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this application');
        }
        const workflow = await this.prisma.workflow.create({
            data: {
                ...data,
                applicationId,
                nodes: JSON.stringify(data.nodes || []),
                edges: JSON.stringify(data.edges || []),
                variables: data.variables ? JSON.stringify(data.variables) : undefined,
            },
            select: {
                id: true,
                name: true,
                description: true,
                nodes: true,
                edges: true,
                variables: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return this.serializeWorkflow(workflow);
    }
    async findByApp(userId, appId) {
        const app = await this.prisma.application.findUnique({
            where: { id: appId },
        });
        if (!app) {
            throw new common_1.NotFoundException('Application not found');
        }
        if (app.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this application');
        }
        return this.prisma.workflow.findMany({
            where: { applicationId: appId },
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async findOne(userId, id) {
        const workflow = await this.prisma.workflow.findUnique({
            where: { id },
            include: {
                application: {
                    select: { userId: true },
                },
            },
        });
        if (!workflow) {
            throw new common_1.NotFoundException('Workflow not found');
        }
        if (workflow.application.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this workflow');
        }
        const { application, ...workflowData } = workflow;
        return this.serializeWorkflow(workflowData);
    }
    async update(userId, id, updateWorkflowDto) {
        const existingWorkflow = await this.prisma.workflow.findUnique({
            where: { id },
            include: {
                application: {
                    select: { userId: true },
                },
            },
        });
        if (!existingWorkflow) {
            throw new common_1.NotFoundException('Workflow not found');
        }
        if (existingWorkflow.application.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to update this workflow');
        }
        const workflow = await this.prisma.workflow.update({
            where: { id },
            data: {
                ...updateWorkflowDto,
                nodes: updateWorkflowDto.nodes ? JSON.stringify(updateWorkflowDto.nodes) : undefined,
                edges: updateWorkflowDto.edges ? JSON.stringify(updateWorkflowDto.edges) : undefined,
                variables: updateWorkflowDto.variables ? JSON.stringify(updateWorkflowDto.variables) : undefined,
            },
            select: {
                id: true,
                name: true,
                description: true,
                nodes: true,
                edges: true,
                variables: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return this.serializeWorkflow(workflow);
    }
    async remove(userId, id) {
        const workflow = await this.prisma.workflow.findUnique({
            where: { id },
            include: {
                application: {
                    select: { userId: true },
                },
            },
        });
        if (!workflow) {
            throw new common_1.NotFoundException('Workflow not found');
        }
        if (workflow.application.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to delete this workflow');
        }
        await this.prisma.workflow.delete({
            where: { id },
        });
        return { success: true };
    }
};
exports.WorkflowService = WorkflowService;
exports.WorkflowService = WorkflowService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkflowService);
//# sourceMappingURL=workflow.service.js.map