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
exports.WorkflowExecutorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../common/services/prisma.service");
const node_executor_factory_1 = require("./node-executor.factory");
let WorkflowExecutorService = class WorkflowExecutorService {
    constructor(prisma, factory) {
        this.prisma = prisma;
        this.factory = factory;
    }
    async executeWorkflow(workflowId, runDto, sseSubject) {
        const workflow = await this.prisma.workflow.findUnique({
            where: { id: workflowId },
        });
        if (!workflow) {
            throw new Error('Workflow not found');
        }
        const nodes = JSON.parse(workflow.nodes);
        const edges = JSON.parse(workflow.edges);
        const adjList = new Map();
        const inDegree = new Map();
        for (const node of nodes) {
            adjList.set(node.id, []);
            inDegree.set(node.id, 0);
        }
        for (const edge of edges) {
            const neighbors = adjList.get(edge.source);
            if (neighbors) {
                neighbors.push({ target: edge.target, sourceHandle: edge.sourceHandle });
            }
            inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
        }
        const context = { ...runDto.inputs };
        const executed = new Set();
        const skipped = new Set();
        const runtimeInDegree = new Map(inDegree);
        const queue = nodes
            .filter((n) => inDegree.get(n.id) === 0)
            .map((n) => n.id);
        while (queue.length > 0) {
            const nodeId = queue.shift();
            if (executed.has(nodeId) || skipped.has(nodeId))
                continue;
            const node = nodes.find((n) => n.id === nodeId);
            if (!node)
                continue;
            const executor = this.factory.getExecutor(node.type);
            try {
                sseSubject?.next({ type: 'node_status', data: { nodeId, status: 'running' } });
                const output = await executor.execute(node, context);
                context[nodeId] = output;
                executed.add(nodeId);
                sseSubject?.next({ type: 'node_status', data: { nodeId, status: 'success', output } });
                const downstream = adjList.get(nodeId) || [];
                if (node.type === 'condition') {
                    const conditionResult = output?.result;
                    const matchHandle = conditionResult ? 'true' : 'false';
                    const skipHandle = conditionResult ? 'false' : 'true';
                    for (const edge of downstream) {
                        if (edge.sourceHandle === matchHandle) {
                            const deg = (runtimeInDegree.get(edge.target) || 1) - 1;
                            runtimeInDegree.set(edge.target, deg);
                            if (deg <= 0) {
                                queue.push(edge.target);
                            }
                        }
                        else if (edge.sourceHandle === skipHandle) {
                            this.skipBranch(edge.target, adjList, skipped, sseSubject);
                        }
                    }
                }
                else {
                    for (const edge of downstream) {
                        const deg = (runtimeInDegree.get(edge.target) || 1) - 1;
                        runtimeInDegree.set(edge.target, deg);
                        if (deg <= 0 && !skipped.has(edge.target)) {
                            queue.push(edge.target);
                        }
                    }
                }
            }
            catch (error) {
                sseSubject?.next({ type: 'node_status', data: { nodeId, status: 'failed', error: error.message } });
                sseSubject?.next({ type: 'error', data: { message: `Error executing node ${nodeId}: ${error.message}` } });
                throw error;
            }
        }
        sseSubject?.next({ type: 'done', data: { finalContext: context } });
        return context;
    }
    skipBranch(nodeId, adjList, skipped, sseSubject) {
        if (skipped.has(nodeId))
            return;
        skipped.add(nodeId);
        sseSubject?.next({ type: 'node_status', data: { nodeId, status: 'skipped' } });
        const downstream = adjList.get(nodeId) || [];
        for (const edge of downstream) {
            this.skipBranch(edge.target, adjList, skipped, sseSubject);
        }
    }
};
exports.WorkflowExecutorService = WorkflowExecutorService;
exports.WorkflowExecutorService = WorkflowExecutorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        node_executor_factory_1.NodeExecutorFactory])
], WorkflowExecutorService);
//# sourceMappingURL=workflow-executor.service.js.map