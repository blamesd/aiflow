import { SkillType } from './create-skill.dto';
export declare class UpdateSkillDto {
    name?: string;
    description?: string;
    type?: SkillType;
    builtinType?: string;
    config?: Record<string, any>;
    inputSchema?: Record<string, any>;
    outputSchema?: Record<string, any>;
    isActive?: boolean;
}
