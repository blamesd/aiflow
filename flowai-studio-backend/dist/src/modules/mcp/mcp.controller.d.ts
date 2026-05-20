import { McpService } from './mcp.service';
export declare class McpController {
    private readonly mcpService;
    constructor(mcpService: McpService);
    getTools(): Promise<{
        name: string;
        description: string;
        inputSchema: any;
    }[]>;
    invokeTool(userId: string, data: {
        toolName: string;
        params: Record<string, unknown>;
    }): Promise<{
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
