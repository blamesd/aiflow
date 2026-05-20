import { INodeExecutor } from '../../types';
export declare class OutputNodeExecutor implements INodeExecutor {
    execute(node: any, context: Record<string, any>): Promise<Record<string, any>>;
    private resolveVariables;
}
