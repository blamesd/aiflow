import { PrismaService } from '../../common/services/prisma.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
export declare class WorkflowService {
    private prisma;
    constructor(prisma: PrismaService);
    private serializeWorkflow;
    private parseJsonField;
    create(userId: string, createWorkflowDto: CreateWorkflowDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        variables: string | null;
        nodes: string;
        edges: string;
    } & {
        nodes: never[];
        edges: never[];
        variables: {} | null;
    }>;
    findByApp(userId: string, appId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }[]>;
    findOne(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        variables: string | null;
        nodes: string;
        edges: string;
        applicationId: string;
    } & {
        nodes: never[];
        edges: never[];
        variables: {} | null;
    }>;
    update(userId: string, id: string, updateWorkflowDto: UpdateWorkflowDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        variables: string | null;
        nodes: string;
        edges: string;
    } & {
        nodes: never[];
        edges: never[];
        variables: {} | null;
    }>;
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
