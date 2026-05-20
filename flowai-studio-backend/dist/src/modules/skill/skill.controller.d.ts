import { SkillService } from './services/skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
export declare class SkillController {
    private skillService;
    constructor(skillService: SkillService);
    getBuiltinSkills(): Promise<({
        type: string;
        name: string;
        description: string;
        inputSchema: {
            url?: undefined;
            method?: undefined;
            headers?: undefined;
            body?: undefined;
            action?: undefined;
            data?: undefined;
            text?: undefined;
            pattern?: undefined;
            flags?: undefined;
        };
        outputSchema: {
            datetime: string;
            timestamp: string;
            date: string;
            time: string;
            status?: undefined;
            data?: undefined;
            headers?: undefined;
            result?: undefined;
            matches?: undefined;
            groups?: undefined;
        };
    } | {
        type: string;
        name: string;
        description: string;
        inputSchema: {
            url: string;
            method: string;
            headers: string;
            body: string;
            action?: undefined;
            data?: undefined;
            text?: undefined;
            pattern?: undefined;
            flags?: undefined;
        };
        outputSchema: {
            status: string;
            data: string;
            headers: string;
            datetime?: undefined;
            timestamp?: undefined;
            date?: undefined;
            time?: undefined;
            result?: undefined;
            matches?: undefined;
            groups?: undefined;
        };
    } | {
        type: string;
        name: string;
        description: string;
        inputSchema: {
            action: string;
            data: string;
            url?: undefined;
            method?: undefined;
            headers?: undefined;
            body?: undefined;
            text?: undefined;
            pattern?: undefined;
            flags?: undefined;
        };
        outputSchema: {
            result: string;
            datetime?: undefined;
            timestamp?: undefined;
            date?: undefined;
            time?: undefined;
            status?: undefined;
            data?: undefined;
            headers?: undefined;
            matches?: undefined;
            groups?: undefined;
        };
    } | {
        type: string;
        name: string;
        description: string;
        inputSchema: {
            text: string;
            pattern: string;
            flags: string;
            url?: undefined;
            method?: undefined;
            headers?: undefined;
            body?: undefined;
            action?: undefined;
            data?: undefined;
        };
        outputSchema: {
            matches: string;
            groups: string;
            datetime?: undefined;
            timestamp?: undefined;
            date?: undefined;
            time?: undefined;
            status?: undefined;
            data?: undefined;
            headers?: undefined;
            result?: undefined;
        };
    })[]>;
    createSkill(userId: string, createSkillDto: CreateSkillDto): Promise<{
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
    findSkills(userId: string): Promise<{
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
    }[]>;
    findSkillById(userId: string, id: string): Promise<{
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
    updateSkill(userId: string, id: string, updateSkillDto: UpdateSkillDto): Promise<{
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
    deleteSkill(userId: string, id: string): Promise<{
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
    executeSkill(id: string, params: Record<string, any>): Promise<any>;
}
