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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../../common/services/prisma.service");
const loginAttempts = new Map();
let UserService = class UserService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.MAX_LOGIN_ATTEMPTS = 5;
        this.LOCKOUT_DURATION = 15 * 60 * 1000;
    }
    checkAccountLock(username) {
        const attempt = loginAttempts.get(username);
        if (attempt?.lockedUntil && attempt.lockedUntil > new Date()) {
            const remainingMinutes = Math.ceil((attempt.lockedUntil.getTime() - Date.now()) / 60000);
            throw new common_1.UnauthorizedException(`账户已被锁定，请 ${remainingMinutes} 分钟后再试`);
        }
    }
    recordLoginAttempt(username, success) {
        let attempt = loginAttempts.get(username);
        if (!attempt) {
            attempt = {
                username,
                attempts: 0,
                lastAttempt: new Date(),
            };
        }
        if (success) {
            attempt.attempts = 0;
            attempt.lockedUntil = undefined;
        }
        else {
            attempt.attempts += 1;
            attempt.lastAttempt = new Date();
            if (attempt.attempts >= this.MAX_LOGIN_ATTEMPTS) {
                attempt.lockedUntil = new Date(Date.now() + this.LOCKOUT_DURATION);
            }
        }
        loginAttempts.set(username, attempt);
    }
    cleanupExpiredAttempts() {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        for (const [username, attempt] of loginAttempts.entries()) {
            if (attempt.lastAttempt < oneHourAgo && !attempt.lockedUntil) {
                loginAttempts.delete(username);
            }
        }
    }
    async register(registerDto) {
        const { username, password } = registerDto;
        if (!username || !password) {
            throw new common_1.BadRequestException('用户名和密码不能为空');
        }
        if (username.length < 3 || username.length > 20) {
            throw new common_1.BadRequestException('用户名长度必须在3-20个字符之间');
        }
        if (password.length < 6) {
            throw new common_1.BadRequestException('密码长度至少为6个字符');
        }
        try {
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    username,
                },
            });
            if (existingUser) {
                throw new common_1.ConflictException('用户名已存在');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    username: true,
                    createdAt: true,
                },
            });
            return user;
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('注册失败，请稍后重试');
        }
    }
    async login(loginDto) {
        const { username, password } = loginDto;
        if (!username || !password) {
            throw new common_1.BadRequestException('用户名和密码不能为空');
        }
        this.cleanupExpiredAttempts();
        this.checkAccountLock(username);
        try {
            const user = await this.prisma.user.findUnique({
                where: { username },
            });
            if (!user) {
                this.recordLoginAttempt(username, false);
                throw new common_1.UnauthorizedException('用户名或密码错误');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                this.recordLoginAttempt(username, false);
                const attempt = loginAttempts.get(username);
                const remainingAttempts = this.MAX_LOGIN_ATTEMPTS - (attempt?.attempts || 0);
                throw new common_1.UnauthorizedException(`用户名或密码错误，剩余尝试次数：${remainingAttempts}`);
            }
            this.recordLoginAttempt(username, true);
            const payload = {
                userId: user.id,
                username: user.username
            };
            const token = this.jwtService.sign(payload);
            return {
                user: {
                    id: user.id,
                    username: user.username,
                },
                token,
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('登录失败，请稍后重试');
        }
    }
    async getProfile(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                    createdAt: true,
                },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('用户不存在');
            }
            return user;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('获取用户信息失败');
        }
    }
    async updateProfile(userId, data) {
        try {
            return this.prisma.user.update({
                where: { id: userId },
                data,
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('更新用户信息失败');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map