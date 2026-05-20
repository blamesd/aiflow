import { Response } from 'express';
import { AiService } from './ai.service';
import { StreamRunDto, RunDto, ChatDto } from './dto/ai.dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    run(userId: string, runDto: RunDto): Promise<{
        success: boolean;
        message: string;
        data: {
            output: any;
            context: Record<string, any>;
        };
    }>;
    streamRun(userId: string, streamRunDto: StreamRunDto, res: Response): Promise<void>;
    chat(userId: string, chatDto: ChatDto, res: Response): Promise<void>;
    getChatHistory(userId: string, sessionId: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        role: string;
        references: string | null;
        toolCalls: string | null;
    }[]>;
    getAllChatHistories(userId: string, appId?: string): Promise<{
        sessionId: any;
        lastMessageAt: any;
    }[]>;
}
