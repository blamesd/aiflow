import { INodeExecutor } from '../../types';
import { RAGService } from '../../../rag/services/rag.service';
export declare class RAGNodeExecutor implements INodeExecutor {
    private readonly ragService;
    constructor(ragService: RAGService);
    execute(node: any, context: Record<string, any>): Promise<Record<string, any>>;
    private resolveVariables;
}
