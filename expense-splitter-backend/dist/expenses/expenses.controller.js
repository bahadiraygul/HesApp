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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const expenses_service_1 = require("./expenses.service");
const create_expense_dto_1 = require("./dto/create-expense.dto");
const update_expense_dto_1 = require("./dto/update-expense.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let ExpensesController = class ExpensesController {
    expensesService;
    constructor(expensesService) {
        this.expensesService = expensesService;
    }
    async create(createExpenseDto, user) {
        return await this.expensesService.create(createExpenseDto, user.id);
    }
    async findAll(groupId, user) {
        return await this.expensesService.findAll(groupId, user.id);
    }
    async findOne(id, user) {
        return await this.expensesService.findOne(id, user.id);
    }
    async update(id, updateExpenseDto, user) {
        return await this.expensesService.update(id, updateExpenseDto, user.id);
    }
    async remove(id, user) {
        await this.expensesService.remove(id, user.id);
    }
    async getGroupBalance(groupId, user) {
        return await this.expensesService.getGroupBalance(groupId, user.id);
    }
};
exports.ExpensesController = ExpensesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new expense' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Expense created successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error or invalid splits' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not a member of the group' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_expense_dto_1.CreateExpenseDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all expenses for a group' }),
    (0, swagger_1.ApiQuery)({ name: 'groupId', description: 'Group ID to filter expenses' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of expenses retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not a member of the group' }),
    __param(0, (0, common_1.Query)('groupId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific expense by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Expense ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Expense details retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Expense not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not a member of the group' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an expense (payer only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Expense ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Expense updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only the payer can update this expense' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Expense not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_expense_dto_1.UpdateExpenseDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an expense (payer only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Expense ID' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Expense deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only the payer can delete this expense' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Expense not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('groups/:groupId/balance'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get group balance and simplified settlement debts',
    }),
    (0, swagger_1.ApiParam)({ name: 'groupId', description: 'Group ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Group balance calculated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not a member of the group' }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ExpensesController.prototype, "getGroupBalance", null);
exports.ExpensesController = ExpensesController = __decorate([
    (0, swagger_1.ApiTags)('expenses'),
    (0, common_1.Controller)('expenses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [expenses_service_1.ExpensesService])
], ExpensesController);
//# sourceMappingURL=expenses.controller.js.map