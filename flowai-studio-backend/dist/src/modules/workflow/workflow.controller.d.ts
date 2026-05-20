import { Response } from 'express';
import { WorkflowService } from './workflow.service';
import { WorkflowExecutorService } from './services/workflow-executor.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { RunWorkflowDto } from './dto/run-workflow.dto';
export declare class WorkflowController {
    private readonly workflowService;
    private readonly workflowExecutorService;
    constructor(workflowService: WorkflowService, workflowExecutorService: WorkflowExecutorService);
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
    run(userId: string, id: string, runWorkflowDto: RunWorkflowDto): Promise<Record<string, any>>;
    streamRun(userId: string, id: string, runWorkflowDto: RunWorkflowDto, res: Response): Promise<void>;
}
