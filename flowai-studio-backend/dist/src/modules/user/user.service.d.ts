import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/services/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class UserService {
    private prisma;
    private jwtService;
    private readonly MAX_LOGIN_ATTEMPTS;
    private readonly LOCKOUT_DURATION;
    constructor(prisma: PrismaService, jwtService: JwtService);
    private checkAccountLock;
    private recordLoginAttempt;
    private cleanupExpiredAttempts;
    register(registerDto: RegisterDto): Promise<{
        id: string;
        username: string;
        createdAt: Date;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            username: string;
        };
        token: string;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        username: string;
        avatar: string | null;
        createdAt: Date;
    }>;
    updateProfile(userId: string, data: {
        username?: string;
        avatar?: string;
    }): Promise<{
        id: string;
        username: string;
        avatar: string | null;
    }>;
}
