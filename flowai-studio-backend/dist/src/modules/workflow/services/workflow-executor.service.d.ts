import { PrismaService } from '../../../common/services/prisma.service';
import { NodeExecutorFactory } from './node-executor.factory';
import { RunWorkflowDto } from '../dto/run-workflow.dto';
import { Subject } from 'rxjs';
export declare class WorkflowExecutorService {
    private readonly prisma;
    private readonly factory;
    constructor(prisma: PrismaService, factory: NodeExecutorFactory);
    executeWorkflow(workflowId: string, runDto: RunWorkflowDto, sseSubject?: Subject<any>): Promise<Record<string, any>>;
    private skipBranch;
}
