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
exports.GroupResponseDto = exports.GroupMemberResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const group_member_entity_1 = require("../entities/group-member.entity");
class GroupMemberResponseDto {
    id;
    userId;
    username;
    fullName;
    role;
    joinedAt;
}
exports.GroupMemberResponseDto = GroupMemberResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    __metadata("design:type", String)
], GroupMemberResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    __metadata("design:type", String)
], GroupMemberResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'johndoe' }),
    __metadata("design:type", String)
], GroupMemberResponseDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    __metadata("design:type", String)
], GroupMemberResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin', enum: group_member_entity_1.GroupRole }),
    __metadata("design:type", String)
], GroupMemberResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], GroupMemberResponseDto.prototype, "joinedAt", void 0);
class GroupResponseDto {
    id;
    name;
    description;
    currency;
    creatorId;
    createdAt;
    updatedAt;
    members;
}
exports.GroupResponseDto = GroupResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    __metadata("design:type", String)
], GroupResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Apartment Expenses' }),
    __metadata("design:type", String)
], GroupResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Shared expenses for our apartment' }),
    __metadata("design:type", String)
], GroupResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TRY' }),
    __metadata("design:type", String)
], GroupResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    __metadata("design:type", String)
], GroupResponseDto.prototype, "creatorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], GroupResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], GroupResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [GroupMemberResponseDto], required: false }),
    __metadata("design:type", Array)
], GroupResponseDto.prototype, "members", void 0);
//# sourceMappingURL=group-response.dto.js.map