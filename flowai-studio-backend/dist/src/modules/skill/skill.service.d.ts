import { PrismaService } from '../../common/services/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
export declare class SkillService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createSkillDto: CreateSkillDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        config: string | null;
        inputSchema: string | null;
        outputSchema: string | null;
        isActive: boolean;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        isActive: boolean;
    }[]>;
    getBuiltinSkills(): ({
        id: string;
        name: string;
        description: string;
        type: string;
        builtinType: string;
        inputSchema: {
            type?: undefined;
            properties?: undefined;
            required?: undefined;
        };
        outputSchema: {
            type: string;
            properties: {
                datetime: {
                    type: string;
                    description: string;
                };
                timestamp: {
                    type: string;
                    description: string;
                };
                status?: undefined;
                data?: undefined;
                headers?: undefined;
                result?: undefined;
                matches?: undefined;
                groups?: undefined;
            };
        };
    } | {
        id: string;
        name: string;
        description: string;
        type: string;
        builtinType: string;
        inputSchema: {
            type: string;
            properties: {
                url: {
                    type: string;
                    description: string;
                };
                method: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                headers: {
                    type: string;
                    description: string;
                };
                body: {
                    type: string;
                    description: string;
                };
                action?: undefined;
                data?: undefined;
                value?: undefined;
                text?: undefined;
                pattern?: undefined;
                flags?: undefined;
            };
            required: string[];
        };
        outputSchema: {
            type: string;
            properties: {
                status: {
                    type: string;
                    description: string;
                };
                data: {
                    type: string;
                    description: string;
                };
                headers: {
                    type: string;
                    description: string;
                };
                datetime?: undefined;
                timestamp?: undefined;
                result?: undefined;
                matches?: undefined;
                groups?: undefined;
            };
        };
    } | {
        id: string;
        name: string;
        description: string;
        type: string;
        builtinType: string;
        inputSchema: {
            type: string;
            properties: {
                action: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                data: {
                    type: string;
                    description: string;
                };
                value: {
                    type: string;
                    description: string;
                };
                url?: undefined;
                method?: undefined;
                headers?: undefined;
                body?: undefined;
                text?: undefined;
                pattern?: undefined;
                flags?: undefined;
            };
            required: string[];
        };
        outputSchema: {
            type: string;
            properties: {
                result: {
                    type: string;
                    description: string;
                };
                datetime?: undefined;
                timestamp?: undefined;
                status?: undefined;
                data?: undefined;
                headers?: undefined;
                matches?: undefined;
                groups?: undefined;
            };
        };
    } | {
        id: string;
        name: string;
        description: string;
        type: string;
        builtinType: string;
        inputSchema: {
            type: string;
            properties: {
                text: {
                    type: string;
                    description: string;
                };
                pattern: {
                    type: string;
                    description: string;
                };
                flags: {
                    type: string;
                    description: string;
                };
                url?: undefined;
                method?: undefined;
                headers?: undefined;
                body?: undefined;
                action?: undefined;
                data?: undefined;
                value?: undefined;
            };
            required: string[];
        };
        outputSchema: {
            type: string;
            properties: {
                matches: {
                    type: string;
                    description: string;
                };
                groups: {
                    type: string;
                    description: string;
                };
                datetime?: undefined;
                timestamp?: undefined;
                status?: undefined;
                data?: undefined;
                headers?: undefined;
                result?: undefined;
            };
        };
    })[];
    findOne(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        userId: string;
        type: string;
        builtinType: string | null;
        config: string | null;
        inputSchema: string | null;
        outputSchema: string | null;
        isActive: boolean;
    }>;
    update(userId: string, id: string, updateSkillDto: UpdateSkillDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: string;
        config: string | null;
        inputSchema: string | null;
        outputSchema: string | null;
        isActive: boolean;
    }>;
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
