import { INodeExecutor } from '../../types';
export declare class UserInputNodeExecutor implements INodeExecutor {
    execute(node: any, context: Record<string, any>): Promise<Record<string, any>>;
}
