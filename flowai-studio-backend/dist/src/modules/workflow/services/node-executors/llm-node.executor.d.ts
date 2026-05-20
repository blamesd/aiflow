import { INodeExecutor } from '../../types';
import { AiService } from '../../../ai/ai.service';
export declare class LLMNodeExecutor implements INodeExecutor {
    private readonly aiService;
    constructor(aiService: AiService);
    execute(node: any, context: Record<string, any>): Promise<Record<string, any>>;
    private resolveVariables;
}
