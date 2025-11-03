import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingEmail = await this.usersService.findByEmail(
      registerDto.email,
    );
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    const existingUsername = await this.usersService.findByUsername(
      registerDto.username,
    );
    if (existingUsername) {
      throw new ConflictException('Username already taken');
    }

    // Hash password
    const hashedPassword = await this.passwordService.hashPassword(
      registerDto.password,
    );

    // Create user
    const user = await this.usersService.create({
      email: registerDto.email,
      username: registerDto.username,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
    });

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      user: new UserResponseDto(user),
      access_token,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Find user by email or username
    let user = await this.usersService.findByEmail(loginDto.emailOrUsername);
    if (!user) {
      user = await this.usersService.findByUsername(loginDto.emailOrUsername);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.passwordService.comparePasswords(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      user: new UserResponseDto(user),
      access_token,
    };
  }

  async validateUser(userId: string) {
    return await this.usersService.findOne(userId);
  }
}
