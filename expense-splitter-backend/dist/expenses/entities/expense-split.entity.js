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
exports.ExpenseSplit = void 0;
const typeorm_1 = require("typeorm");
const expense_entity_1 = require("./expense.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let ExpenseSplit = class ExpenseSplit {
    id;
    amount;
    createdAt;
    expenseId;
    expense;
    userId;
    user;
};
exports.ExpenseSplit = ExpenseSplit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ExpenseSplit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ExpenseSplit.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ExpenseSplit.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExpenseSplit.prototype, "expenseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => expense_entity_1.Expense),
    (0, typeorm_1.JoinColumn)({ name: 'expenseId' }),
    __metadata("design:type", expense_entity_1.Expense)
], ExpenseSplit.prototype, "expense", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExpenseSplit.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], ExpenseSplit.prototype, "user", void 0);
exports.ExpenseSplit = ExpenseSplit = __decorate([
    (0, typeorm_1.Entity)('expense_splits')
], ExpenseSplit);
//# sourceMappingURL=expense-split.entity.js.map