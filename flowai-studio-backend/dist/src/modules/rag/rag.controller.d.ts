import { RAGService } from './services/rag.service';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge-base.dto';
import { UpdateKnowledgeBaseDto } from './dto/update-knowledge-base.dto';
export declare class RAGController {
    private readonly ragService;
    constructor(ragService: RAGService);
    createKnowledgeBase(userId: string, createKnowledgeBaseDto: CreateKnowledgeBaseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        embeddingModel: string;
        chunkSize: number;
        chunkOverlap: number;
        topK: number;
        similarityThreshold: number;
        userId: string;
    }>;
    findKnowledgeBases(userId: string): Promise<({
        documents: {
            id: string;
            createdAt: Date;
            name: string;
            size: number;
            status: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        embeddingModel: string;
        chunkSize: number;
        chunkOverlap: number;
        topK: number;
        similarityThreshold: number;
        userId: string;
    })[]>;
    findKnowledgeBaseById(userId: string, id: string): Promise<{
        documents: {
            error: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            content: string;
            mimeType: string;
            size: number;
            status: string;
            metadata: string | null;
            knowledgeBaseId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        embeddingModel: string;
        chunkSize: number;
        chunkOverlap: number;
        topK: number;
        similarityThreshold: number;
        userId: string;
    }>;
    updateKnowledgeBase(userId: string, id: string, updateKnowledgeBaseDto: UpdateKnowledgeBaseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        embeddingModel: string;
        chunkSize: number;
        chunkOverlap: number;
        topK: number;
        similarityThreshold: number;
        userId: string;
    }>;
    deleteKnowledgeBase(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        embeddingModel: string;
        chunkSize: number;
        chunkOverlap: number;
        topK: number;
        similarityThreshold: number;
        userId: string;
    }>;
    uploadDocument(userId: string, knowledgeBaseId: string, file: Express.Multer.File): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        content: string;
        mimeType: string;
        size: number;
        status: string;
        metadata: string | null;
        knowledgeBaseId: string;
    }>;
    getDocumentChunks(userId: string, documentId: string): Promise<{
        documentId: string;
        documentName: string;
        totalChunks: number;
        chunks: {
            id: string;
            createdAt: Date;
            content: string;
            metadata: string | null;
            chunkIndex: number;
            startIndex: number;
            endIndex: number;
        }[];
    }>;
    deleteDocument(userId: string, documentId: string): Promise<{
        error: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        content: string;
        mimeType: string;
        size: number;
        status: string;
        metadata: string | null;
        knowledgeBaseId: string;
    }>;
    retrieve(query: string, knowledgeBaseId: string, topK?: number): Promise<{
        id: string;
        content: string;
        documentId: string;
        documentName: string;
        similarity: number;
    }[]>;
}
