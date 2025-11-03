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
exports.AuthResponseDto = exports.UserResponseDto = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class UserResponseDto {
    id;
    email;
    username;
    firstName;
    lastName;
    createdAt;
    updatedAt;
    password;
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'johndoe' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Doe' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "password", void 0);
class AuthResponseDto {
    user;
    access_token;
}
exports.AuthResponseDto = AuthResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserResponseDto }),
    __metadata("design:type", UserResponseDto)
], AuthResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT access token',
    }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "access_token", void 0);
//# sourceMappingURL=auth-response.dto.js.map