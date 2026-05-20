export declare enum SkillType {
    BUILTIN = "builtin",
    CUSTOM = "custom"
}
export declare class CreateSkillDto {
    name: string;
    description?: string;
    type: SkillType;
    builtinType?: string;
    config?: Record<string, any>;
    inputSchema?: Record<string, any>;
    outputSchema?: Record<string, any>;
    isActive?: boolean;
}
