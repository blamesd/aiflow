import { INodeExecutor } from '../../types';
export declare class ConditionNodeExecutor implements INodeExecutor {
    execute(node: any, context: Record<string, any>): Promise<Record<string, any>>;
    private resolveVariable;
    private evaluate;
}
