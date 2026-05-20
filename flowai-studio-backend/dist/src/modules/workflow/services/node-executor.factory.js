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
exports.NodeExecutorFactory = void 0;
const common_1 = require("@nestjs/common");
const start_node_executor_1 = require("./node-executors/start-node.executor");
const llm_node_executor_1 = require("./node-executors/llm-node.executor");
const rag_node_executor_1 = require("./node-executors/rag-node.executor");
const skill_node_executor_1 = require("./node-executors/skill-node.executor");
const condition_node_executor_1 = require("./node-executors/condition-node.executor");
const output_node_executor_1 = require("./node-executors/output-node.executor");
const user_input_node_executor_1 = require("./node-executors/user-input-node.executor");
let NodeExecutorFactory = class NodeExecutorFactory {
    constructor(startNodeExecutor, llmNodeExecutor, ragNodeExecutor, skillNodeExecutor, conditionNodeExecutor, outputNodeExecutor, userInputNodeExecutor) {
        this.startNodeExecutor = startNodeExecutor;
        this.llmNodeExecutor = llmNodeExecutor;
        this.ragNodeExecutor = ragNodeExecutor;
        this.skillNodeExecutor = skillNodeExecutor;
        this.conditionNodeExecutor = conditionNodeExecutor;
        this.outputNodeExecutor = outputNodeExecutor;
        this.userInputNodeExecutor = userInputNodeExecutor;
        this.executors = new Map();
        this.executors.set('start', this.startNodeExecutor);
        this.executors.set('llm', this.llmNodeExecutor);
        this.executors.set('rag', this.ragNodeExecutor);
        this.executors.set('skill', this.skillNodeExecutor);
        this.executors.set('condition', this.conditionNodeExecutor);
        this.executors.set('output', this.outputNodeExecutor);
        this.executors.set('userInput', this.userInputNodeExecutor);
    }
    getExecutor(nodeType) {
        const executor = this.executors.get(nodeType);
        if (!executor) {
            throw new Error(`No executor found for node type: ${nodeType}`);
        }
        return executor;
    }
};
exports.NodeExecutorFactory = NodeExecutorFactory;
exports.NodeExecutorFactory = NodeExecutorFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [start_node_executor_1.StartNodeExecutor,
        llm_node_executor_1.LLMNodeExecutor,
        rag_node_executor_1.RAGNodeExecutor,
        skill_node_executor_1.SkillNodeExecutor,
        condition_node_executor_1.ConditionNodeExecutor,
        output_node_executor_1.OutputNodeExecutor,
        user_input_node_executor_1.UserInputNodeExecutor])
], NodeExecutorFactory);
//# sourceMappingURL=node-executor.factory.js.map