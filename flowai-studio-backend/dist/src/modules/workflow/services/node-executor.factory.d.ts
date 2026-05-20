import { INodeExecutor } from '../types';
import { StartNodeExecutor } from './node-executors/start-node.executor';
import { LLMNodeExecutor } from './node-executors/llm-node.executor';
import { RAGNodeExecutor } from './node-executors/rag-node.executor';
import { SkillNodeExecutor } from './node-executors/skill-node.executor';
import { ConditionNodeExecutor } from './node-executors/condition-node.executor';
import { OutputNodeExecutor } from './node-executors/output-node.executor';
import { UserInputNodeExecutor } from './node-executors/user-input-node.executor';
export declare class NodeExecutorFactory {
    private readonly startNodeExecutor;
    private readonly llmNodeExecutor;
    private readonly ragNodeExecutor;
    private readonly skillNodeExecutor;
    private readonly conditionNodeExecutor;
    private readonly outputNodeExecutor;
    private readonly userInputNodeExecutor;
    private executors;
    constructor(startNodeExecutor: StartNodeExecutor, llmNodeExecutor: LLMNodeExecutor, ragNodeExecutor: RAGNodeExecutor, skillNodeExecutor: SkillNodeExecutor, conditionNodeExecutor: ConditionNodeExecutor, outputNodeExecutor: OutputNodeExecutor, userInputNodeExecutor: UserInputNodeExecutor);
    getExecutor(nodeType: string): INodeExecutor;
}
