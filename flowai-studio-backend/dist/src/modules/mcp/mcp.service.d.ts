export declare class McpService {
    private tools;
    constructor();
    private registerBuiltinTools;
    getTools(): Promise<{
        name: string;
        description: string;
        inputSchema: any;
    }[]>;
    invokeTool(userId: string, toolName: string, params: Record<string, unknown>): Promise<{
        success: boolean;
        tool: string;
        result: unknown;
        error?: undefined;
    } | {
        success: boolean;
        tool: string;
        error: string;
        result?: undefined;
    }>;
}
