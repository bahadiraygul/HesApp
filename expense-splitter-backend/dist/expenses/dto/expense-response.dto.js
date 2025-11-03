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
exports.ExpenseResponseDto = exports.ExpenseSplitResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ExpenseSplitResponseDto {
    id;
    userId;
    username;
    amount;
    createdAt;
}
exports.ExpenseSplitResponseDto = ExpenseSplitResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    __metadata("design:type", String)
], ExpenseSplitResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    __metadata("design:type", String)
], ExpenseSplitResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'johndoe' }),
    __metadata("design:type", String)
], ExpenseSplitResponseDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50.0 }),
    __metadata("design:type", Number)
], ExpenseSplitResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], ExpenseSplitResponseDto.prototype, "createdAt", void 0);
class ExpenseResponseDto {
    id;
    description;
    amount;
    currency;
    category;
    date;
    paidById;
    paidByUsername;
    groupId;
    createdAt;
    updatedAt;
    splits;
}
exports.ExpenseResponseDto = ExpenseResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Grocery shopping' }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 150.5 }),
    __metadata("design:type", Number)
], ExpenseResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TRY' }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Food' }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15' }),
    __metadata("design:type", Date)
], ExpenseResponseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "paidById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'johndoe' }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "paidByUsername", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    __metadata("design:type", String)
], ExpenseResponseDto.prototype, "groupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], ExpenseResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], ExpenseResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ExpenseSplitResponseDto], required: false }),
    __metadata("design:type", Array)
], ExpenseResponseDto.prototype, "splits", void 0);
//# sourceMappingURL=expense-response.dto.js.map