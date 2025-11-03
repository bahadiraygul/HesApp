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
exports.GroupBalanceResponseDto = exports.DebtDto = exports.UserBalanceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UserBalanceDto {
    userId;
    username;
    fullName;
    totalPaid;
    totalOwed;
    balance;
}
exports.UserBalanceDto = UserBalanceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    __metadata("design:type", String)
], UserBalanceDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'johndoe' }),
    __metadata("design:type", String)
], UserBalanceDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    __metadata("design:type", String)
], UserBalanceDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 250.0, description: 'Total amount paid by this user' }),
    __metadata("design:type", Number)
], UserBalanceDto.prototype, "totalPaid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 150.0, description: 'Total amount owed by this user' }),
    __metadata("design:type", Number)
], UserBalanceDto.prototype, "totalOwed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 100.0,
        description: 'Net balance (positive means others owe this user, negative means this user owes others)',
    }),
    __metadata("design:type", Number)
], UserBalanceDto.prototype, "balance", void 0);
class DebtDto {
    fromUserId;
    fromUsername;
    toUserId;
    toUsername;
    amount;
}
exports.DebtDto = DebtDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    __metadata("design:type", String)
], DebtDto.prototype, "fromUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'johndoe' }),
    __metadata("design:type", String)
], DebtDto.prototype, "fromUsername", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '660e8400-e29b-41d4-a716-446655440001' }),
    __metadata("design:type", String)
], DebtDto.prototype, "toUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'janedoe' }),
    __metadata("design:type", String)
], DebtDto.prototype, "toUsername", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50.0 }),
    __metadata("design:type", Number)
], DebtDto.prototype, "amount", void 0);
class GroupBalanceResponseDto {
    groupId;
    groupName;
    currency;
    userBalances;
    simplifiedDebts;
}
exports.GroupBalanceResponseDto = GroupBalanceResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    __metadata("design:type", String)
], GroupBalanceResponseDto.prototype, "groupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Apartment Expenses' }),
    __metadata("design:type", String)
], GroupBalanceResponseDto.prototype, "groupName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TRY' }),
    __metadata("design:type", String)
], GroupBalanceResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UserBalanceDto] }),
    __metadata("design:type", Array)
], GroupBalanceResponseDto.prototype, "userBalances", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [DebtDto], description: 'Simplified debts (optimized settlements)' }),
    __metadata("design:type", Array)
], GroupBalanceResponseDto.prototype, "simplifiedDebts", void 0);
//# sourceMappingURL=balance-response.dto.js.map