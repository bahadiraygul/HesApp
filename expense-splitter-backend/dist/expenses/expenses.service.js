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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const expense_entity_1 = require("./entities/expense.entity");
const expense_split_entity_1 = require("./entities/expense-split.entity");
const groups_service_1 = require("../groups/groups.service");
let ExpensesService = class ExpensesService {
    expensesRepository;
    expenseSplitsRepository;
    groupsService;
    constructor(expensesRepository, expenseSplitsRepository, groupsService) {
        this.expensesRepository = expensesRepository;
        this.expenseSplitsRepository = expenseSplitsRepository;
        this.groupsService = groupsService;
    }
    async create(createExpenseDto, userId) {
        await this.groupsService.checkMembership(createExpenseDto.groupId, userId);
        this.validateSplits(createExpenseDto.splits, createExpenseDto.amount);
        const expense = this.expensesRepository.create({
            description: createExpenseDto.description,
            amount: createExpenseDto.amount,
            currency: createExpenseDto.currency || 'TRY',
            category: createExpenseDto.category,
            date: new Date(createExpenseDto.date),
            paidById: userId,
            groupId: createExpenseDto.groupId,
        });
        const savedExpense = await this.expensesRepository.save(expense);
        const splits = createExpenseDto.splits.map((split) => this.expenseSplitsRepository.create({
            expenseId: savedExpense.id,
            userId: split.userId,
            amount: split.amount,
        }));
        await this.expenseSplitsRepository.save(splits);
        return await this.findOne(savedExpense.id, userId);
    }
    async findAll(groupId, userId) {
        if (groupId) {
            await this.groupsService.checkMembership(groupId, userId);
            return await this.expensesRepository.find({
                where: { groupId },
                relations: ['paidBy', 'group', 'splits', 'splits.user'],
                order: { date: 'DESC', createdAt: 'DESC' },
            });
        }
        const userGroups = await this.groupsService.findAll(userId);
        const groupIds = userGroups.map((group) => group.id);
        if (groupIds.length === 0) {
            return [];
        }
        return await this.expensesRepository
            .createQueryBuilder('expense')
            .leftJoinAndSelect('expense.paidBy', 'paidBy')
            .leftJoinAndSelect('expense.group', 'group')
            .leftJoinAndSelect('expense.splits', 'splits')
            .leftJoinAndSelect('splits.user', 'user')
            .where('expense.groupId IN (:...groupIds)', { groupIds })
            .orderBy('expense.date', 'DESC')
            .addOrderBy('expense.createdAt', 'DESC')
            .getMany();
    }
    async findOne(id, userId) {
        const expense = await this.expensesRepository.findOne({
            where: { id },
            relations: ['paidBy', 'group', 'splits', 'splits.user'],
        });
        if (!expense) {
            throw new common_1.NotFoundException(`Expense with ID ${id} not found`);
        }
        await this.groupsService.checkMembership(expense.groupId, userId);
        return expense;
    }
    async update(id, updateExpenseDto, userId) {
        const expense = await this.findOne(id, userId);
        if (expense.paidById !== userId) {
            throw new common_1.ForbiddenException('Only the payer can update this expense');
        }
        if (updateExpenseDto.splits) {
            const newAmount = updateExpenseDto.amount ?? expense.amount;
            this.validateSplits(updateExpenseDto.splits, newAmount);
            await this.expenseSplitsRepository.delete({ expenseId: id });
            const splits = updateExpenseDto.splits.map((split) => this.expenseSplitsRepository.create({
                expenseId: id,
                userId: split.userId,
                amount: split.amount,
            }));
            await this.expenseSplitsRepository.save(splits);
        }
        const updatePayload = {
            description: updateExpenseDto.description ?? expense.description,
            amount: updateExpenseDto.amount ?? expense.amount,
            currency: updateExpenseDto.currency ?? expense.currency,
            category: updateExpenseDto.category ?? expense.category,
            date: updateExpenseDto.date ? new Date(updateExpenseDto.date) : expense.date,
        };
        await this.expensesRepository.update(id, updatePayload);
        return await this.findOne(id, userId);
    }
    async remove(id, userId) {
        const expense = await this.findOne(id, userId);
        if (expense.paidById !== userId) {
            throw new common_1.ForbiddenException('Only the payer can delete this expense');
        }
        await this.expensesRepository.remove(expense);
    }
    async getGroupBalance(groupId, userId) {
        await this.groupsService.checkMembership(groupId, userId);
        const group = await this.groupsService.findOne(groupId, userId);
        const expenses = await this.expensesRepository.find({
            where: { groupId },
            relations: ['paidBy', 'splits', 'splits.user'],
        });
        const balanceMap = new Map();
        for (const member of group.members) {
            balanceMap.set(member.userId, {
                userId: member.userId,
                username: member.user?.username || 'Unknown',
                fullName: `${member.user?.firstName || ''} ${member.user?.lastName || ''}`.trim(),
                totalPaid: 0,
                totalOwed: 0,
                balance: 0,
            });
        }
        for (const expense of expenses) {
            const payer = balanceMap.get(expense.paidById);
            if (payer) {
                payer.totalPaid += Number(expense.amount);
            }
            for (const split of expense.splits) {
                const debtor = balanceMap.get(split.userId);
                if (debtor) {
                    debtor.totalOwed += Number(split.amount);
                }
            }
        }
        const userBalances = [];
        for (const balance of balanceMap.values()) {
            balance.balance = balance.totalPaid - balance.totalOwed;
            userBalances.push(balance);
        }
        const simplifiedDebts = this.simplifyDebts(userBalances);
        return {
            groupId: group.id,
            groupName: group.name,
            currency: group.currency,
            userBalances,
            simplifiedDebts,
        };
    }
    validateSplits(splits, totalAmount) {
        const splitSum = splits.reduce((sum, split) => sum + Number(split.amount), 0);
        if (Math.abs(splitSum - totalAmount) > 0.01) {
            throw new common_1.BadRequestException(`Split amounts (${splitSum}) must equal the total expense amount (${totalAmount})`);
        }
    }
    simplifyDebts(userBalances) {
        const debts = [];
        const creditors = userBalances
            .filter((u) => u.balance > 0.01)
            .map((u) => ({ ...u, remaining: u.balance }))
            .sort((a, b) => b.remaining - a.remaining);
        const debtors = userBalances
            .filter((u) => u.balance < -0.01)
            .map((u) => ({ ...u, remaining: Math.abs(u.balance) }))
            .sort((a, b) => b.remaining - a.remaining);
        let i = 0;
        let j = 0;
        while (i < creditors.length && j < debtors.length) {
            const creditor = creditors[i];
            const debtor = debtors[j];
            const amount = Math.min(creditor.remaining, debtor.remaining);
            if (amount > 0.01) {
                debts.push({
                    fromUserId: debtor.userId,
                    fromUsername: debtor.username,
                    toUserId: creditor.userId,
                    toUsername: creditor.username,
                    amount: Math.round(amount * 100) / 100,
                });
            }
            creditor.remaining -= amount;
            debtor.remaining -= amount;
            if (creditor.remaining < 0.01)
                i++;
            if (debtor.remaining < 0.01)
                j++;
        }
        return debts;
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(expense_entity_1.Expense)),
    __param(1, (0, typeorm_1.InjectRepository)(expense_split_entity_1.ExpenseSplit)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        groups_service_1.GroupsService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map