import { INodeExecutor } from '../../types';
import { SkillService } from '../../../skill/services/skill.service';
export declare class SkillNodeExecutor implements INodeExecutor {
    private readonly skillService;
    constructor(skillService: SkillService);
    execute(node: any, context: Record<string, any>): Promise<Record<string, any>>;
    private resolveParameters;
    private resolveVariables;
}
