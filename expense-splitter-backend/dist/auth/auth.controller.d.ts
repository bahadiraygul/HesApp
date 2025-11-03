import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { UserResponseDto } from './dto/auth-response.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("./dto/auth-response.dto").AuthResponseDto>;
    login(loginDto: LoginDto): Promise<import("./dto/auth-response.dto").AuthResponseDto>;
    getProfile(user: User): Promise<UserResponseDto>;
}
