export declare class CreateWorkflowDto {
    name: string;
    description?: string;
    applicationId: string;
    nodes?: any[];
    edges?: any[];
    variables?: Record<string, unknown>;
}
