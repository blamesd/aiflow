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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowController = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const workflow_service_1 = require("./workflow.service");
const workflow_executor_service_1 = require("./services/workflow-executor.service");
const create_workflow_dto_1 = require("./dto/create-workflow.dto");
const update_workflow_dto_1 = require("./dto/update-workflow.dto");
const run_workflow_dto_1 = require("./dto/run-workflow.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let WorkflowController = class WorkflowController {
    constructor(workflowService, workflowExecutorService) {
        this.workflowService = workflowService;
        this.workflowExecutorService = workflowExecutorService;
    }
    create(userId, createWorkflowDto) {
        return this.workflowService.create(userId, createWorkflowDto);
    }
    findByApp(userId, appId) {
        return this.workflowService.findByApp(userId, appId);
    }
    findOne(userId, id) {
        return this.workflowService.findOne(userId, id);
    }
    update(userId, id, updateWorkflowDto) {
        return this.workflowService.update(userId, id, updateWorkflowDto);
    }
    remove(userId, id) {
        return this.workflowService.remove(userId, id);
    }
    async run(userId, id, runWorkflowDto) {
        return this.workflowExecutorService.executeWorkflow(id, runWorkflowDto);
    }
    async streamRun(userId, id, runWorkflowDto, res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        const sseSubject = new rxjs_1.Subject();
        sseSubject.subscribe({
            next: (event) => {
                res.write(`data: ${JSON.stringify(event)}\n\n`);
            },
            complete: () => {
                res.end();
            },
            error: (err) => {
                res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
                res.end();
            },
        });
        try {
            await this.workflowExecutorService.executeWorkflow(id, runWorkflowDto, sseSubject);
            sseSubject.complete();
        }
        catch (error) {
            sseSubject.error(error);
        }
    }
};
exports.WorkflowController = WorkflowController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_workflow_dto_1.CreateWorkflowDto]),
    __metadata("design:returntype", void 0)
], WorkflowController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('app/:appId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('appId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WorkflowController.prototype, "findByApp", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WorkflowController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_workflow_dto_1.UpdateWorkflowDto]),
    __metadata("design:returntype", void 0)
], WorkflowController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WorkflowController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/run'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, run_workflow_dto_1.RunWorkflowDto]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "run", null);
__decorate([
    (0, common_1.Post)(':id/run/stream'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, run_workflow_dto_1.RunWorkflowDto, Object]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "streamRun", null);
exports.WorkflowController = WorkflowController = __decorate([
    (0, common_1.Controller)('workflows'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [workflow_service_1.WorkflowService,
        workflow_executor_service_1.WorkflowExecutorService])
], WorkflowController);
//# sourceMappingURL=workflow.controller.js.map