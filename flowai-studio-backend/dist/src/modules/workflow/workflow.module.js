"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowModule = void 0;
const common_1 = require("@nestjs/common");
const workflow_controller_1 = require("./workflow.controller");
const workflow_service_1 = require("./workflow.service");
const workflow_executor_service_1 = require("./services/workflow-executor.service");
const node_executor_factory_1 = require("./services/node-executor.factory");
const start_node_executor_1 = require("./services/node-executors/start-node.executor");
const user_input_node_executor_1 = require("./services/node-executors/user-input-node.executor");
const llm_node_executor_1 = require("./services/node-executors/llm-node.executor");
const rag_node_executor_1 = require("./services/node-executors/rag-node.executor");
const skill_node_executor_1 = require("./services/node-executors/skill-node.executor");
const condition_node_executor_1 = require("./services/node-executors/condition-node.executor");
const output_node_executor_1 = require("./services/node-executors/output-node.executor");
const prisma_module_1 = require("../../common/modules/prisma.module");
const rag_module_1 = require("../rag/rag.module");
const skill_module_1 = require("../skill/skill.module");
const ai_module_1 = require("../ai/ai.module");
let WorkflowModule = class WorkflowModule {
};
exports.WorkflowModule = WorkflowModule;
exports.WorkflowModule = WorkflowModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, rag_module_1.RAGModule, skill_module_1.SkillModule, (0, common_1.forwardRef)(() => ai_module_1.AiModule)],
        controllers: [workflow_controller_1.WorkflowController],
        providers: [
            workflow_service_1.WorkflowService,
            workflow_executor_service_1.WorkflowExecutorService,
            node_executor_factory_1.NodeExecutorFactory,
            start_node_executor_1.StartNodeExecutor,
            user_input_node_executor_1.UserInputNodeExecutor,
            llm_node_executor_1.LLMNodeExecutor,
            rag_node_executor_1.RAGNodeExecutor,
            skill_node_executor_1.SkillNodeExecutor,
            condition_node_executor_1.ConditionNodeExecutor,
            output_node_executor_1.OutputNodeExecutor,
        ],
        exports: [workflow_executor_service_1.WorkflowExecutorService],
    })
], WorkflowModule);
//# sourceMappingURL=workflow.module.js.map