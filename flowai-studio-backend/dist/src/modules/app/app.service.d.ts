import { PrismaService } from '../../common/services/prisma.service';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
export declare class AppService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createAppDto: CreateAppDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: string;
        icon: string | null;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: string;
        icon: string | null;
    }[]>;
    findOne(userId: string, id: string): Promise<{
        workflows: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        userId: string;
        status: string;
        icon: string | null;
        shareLink: string | null;
    }>;
    update(userId: string, id: string, updateAppDto: UpdateAppDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: string;
        icon: string | null;
    }>;
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
    publish(userId: string, id: string): Promise<{
        id: string;
        name: string;
        status: string;
    }>;
    unpublish(userId: string, id: string): Promise<{
        id: string;
        name: string;
        status: string;
    }>;
}
