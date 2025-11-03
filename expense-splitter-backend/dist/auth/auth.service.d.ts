import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly passwordService;
    private readonly jwtService;
    constructor(usersService: UsersService, passwordService: PasswordService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    validateUser(userId: string): Promise<import("../users/entities/user.entity").User>;
}
