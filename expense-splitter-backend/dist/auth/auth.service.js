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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const password_service_1 = require("./password.service");
const auth_response_dto_1 = require("./dto/auth-response.dto");
let AuthService = class AuthService {
    usersService;
    passwordService;
    jwtService;
    constructor(usersService, passwordService, jwtService) {
        this.usersService = usersService;
        this.passwordService = passwordService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const existingEmail = await this.usersService.findByEmail(registerDto.email);
        if (existingEmail) {
            throw new common_1.ConflictException('Email already registered');
        }
        const existingUsername = await this.usersService.findByUsername(registerDto.username);
        if (existingUsername) {
            throw new common_1.ConflictException('Username already taken');
        }
        const hashedPassword = await this.passwordService.hashPassword(registerDto.password);
        const user = await this.usersService.create({
            email: registerDto.email,
            username: registerDto.username,
            password: hashedPassword,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
        });
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
        };
        const access_token = this.jwtService.sign(payload);
        return {
            user: new auth_response_dto_1.UserResponseDto(user),
            access_token,
        };
    }
    async login(loginDto) {
        let user = await this.usersService.findByEmail(loginDto.emailOrUsername);
        if (!user) {
            user = await this.usersService.findByUsername(loginDto.emailOrUsername);
        }
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await this.passwordService.comparePasswords(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
        };
        const access_token = this.jwtService.sign(payload);
        return {
            user: new auth_response_dto_1.UserResponseDto(user),
            access_token,
        };
    }
    async validateUser(userId) {
        return await this.usersService.findOne(userId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        password_service_1.PasswordService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map