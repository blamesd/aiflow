"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/services/prisma.service");
let AppService = class AppService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createAppDto) {
        return this.prisma.application.create({
            data: {
                ...createAppDto,
                userId,
            },
            select: {
                id: true,
                name: true,
                description: true,
                icon: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.application.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                name: true,
                description: true,
                icon: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async findOne(userId, id) {
        const app = await this.prisma.application.findUnique({
            where: { id },
            include: {
                workflows: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
        if (!app) {
            throw new common_1.NotFoundException('Application not found');
        }
        if (app.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this application');
        }
        return app;
    }
    async update(userId, id, updateAppDto) {
        const app = await this.prisma.application.findUnique({
            where: { id },
        });
        if (!app) {
            throw new common_1.NotFoundException('Application not found');
        }
        if (app.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to update this application');
        }
        return this.prisma.application.update({
            where: { id },
            data: updateAppDto,
            select: {
                id: true,
                name: true,
                description: true,
                icon: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async remove(userId, id) {
        const app = await this.prisma.application.findUnique({
            where: { id },
        });
        if (!app) {
            throw new common_1.NotFoundException('Application not found');
        }
        if (app.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to delete this application');
        }
        await this.prisma.application.delete({
            where: { id },
        });
        return { success: true };
    }
    async publish(userId, id) {
        const app = await this.prisma.application.findUnique({
            where: { id },
        });
        if (!app) {
            throw new common_1.NotFoundException('Application not found');
        }
        if (app.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to publish this application');
        }
        return this.prisma.application.update({
            where: { id },
            data: { status: 'published' },
            select: {
                id: true,
                name: true,
                status: true,
            },
        });
    }
    async unpublish(userId, id) {
        const app = await this.prisma.application.findUnique({
            where: { id },
        });
        if (!app) {
            throw new common_1.NotFoundException('Application not found');
        }
        if (app.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to unpublish this application');
        }
        return this.prisma.application.update({
            where: { id },
            data: { status: 'draft' },
            select: {
                id: true,
                name: true,
                status: true,
            },
        });
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppService);
//# sourceMappingURL=app.service.js.map