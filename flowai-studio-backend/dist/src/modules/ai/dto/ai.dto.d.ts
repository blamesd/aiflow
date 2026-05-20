export declare class RunDto {
    appId: string;
    workflowId?: string;
    inputs: Record<string, unknown>;
    sessionId?: string;
}
export declare class StreamRunDto extends RunDto {
}
export declare class ChatDto {
    message: string;
    history?: Array<{
        role: 'user' | 'assistant' | 'system';
        content: string;
    }>;
    sessionId?: string;
    knowledgeBaseId?: string;
}
