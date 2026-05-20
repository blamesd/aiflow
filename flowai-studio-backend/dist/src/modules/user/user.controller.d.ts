import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
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
