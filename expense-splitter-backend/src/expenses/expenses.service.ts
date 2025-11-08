import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { ExpenseSplit } from './entities/expense-split.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { GroupsService } from '../groups/groups.service';
import {
  GroupBalanceResponseDto,
  UserBalanceDto,
  DebtDto,
} from './dto/balance-response.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expensesRepository: Repository<Expense>,
    @InjectRepository(ExpenseSplit)
    private readonly expenseSplitsRepository: Repository<ExpenseSplit>,
    private readonly groupsService: GroupsService,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    userId: string,
  ): Promise<Expense> {
    // Check if user is a member of the group
    await this.groupsService.checkMembership(
      createExpenseDto.groupId,
      userId,
    );

    // Validate splits
    this.validateSplits(createExpenseDto.splits, createExpenseDto.amount);

    // Create expense
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

    // Create splits
    const splits = createExpenseDto.splits.map((split) =>
      this.expenseSplitsRepository.create({
        expenseId: savedExpense.id,
        userId: split.userId,
        amount: split.amount,
      }),
    );

    await this.expenseSplitsRepository.save(splits);

    return await this.findOne(savedExpense.id, userId);
  }

  async findAll(groupId: string | undefined, userId: string): Promise<Expense[]> {
    // If groupId is provided, check membership and return group expenses
    if (groupId) {
      await this.groupsService.checkMembership(groupId, userId);
      return await this.expensesRepository.find({
        where: { groupId },
        relations: ['paidBy', 'group', 'splits', 'splits.user'],
        order: { date: 'DESC', createdAt: 'DESC' },
      });
    }

    // If no groupId, return all expenses from user's groups
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

  async findOne(id: string, userId: string): Promise<Expense> {
    const expense = await this.expensesRepository.findOne({
      where: { id },
      relations: ['paidBy', 'group', 'splits', 'splits.user'],
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    // Check if user is a member of the group
    await this.groupsService.checkMembership(expense.groupId, userId);

    return expense;
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
    userId: string,
  ): Promise<Expense> {
    const expense = await this.findOne(id, userId);

    // Only the person who paid can update the expense
    if (expense.paidById !== userId) {
      throw new ForbiddenException('Only the payer can update this expense');
    }

    // If splits are being updated, validate them
    if (updateExpenseDto.splits) {
      const newAmount = updateExpenseDto.amount ?? expense.amount;
      this.validateSplits(updateExpenseDto.splits, newAmount);

      // Delete old splits
      await this.expenseSplitsRepository.delete({ expenseId: id });

      // Create new splits
      const splits = updateExpenseDto.splits.map((split) =>
        this.expenseSplitsRepository.create({
          expenseId: id,
          userId: split.userId,
          amount: split.amount,
        }),
      );
      await this.expenseSplitsRepository.save(splits);
    }

    // Using a direct update is safer than Object.assign and save,
    // which can sometimes cause issues with relations.
    const updatePayload: Partial<UpdateExpenseDto> = {
      description: updateExpenseDto.description ?? expense.description,
      amount: updateExpenseDto.amount ?? expense.amount,
      currency: updateExpenseDto.currency ?? expense.currency,
      category: updateExpenseDto.category ?? expense.category,
      date: updateExpenseDto.date ? new Date(updateExpenseDto.date) : expense.date, // This line is correct
    };

    await this.expensesRepository.update(id, updatePayload);

    return await this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const expense = await this.findOne(id, userId);

    // Only the person who paid can delete the expense
    if (expense.paidById !== userId) {
      throw new ForbiddenException('Only the payer can delete this expense');
    }

    await this.expensesRepository.remove(expense);
  }

  // Balance Calculation
  async getGroupBalance(
    groupId: string,
    userId: string,
  ): Promise<GroupBalanceResponseDto> {
    // Check if user is a member
    await this.groupsService.checkMembership(groupId, userId);

    // Get group with members
    const group = await this.groupsService.findOne(groupId, userId);

    // Get all expenses for this group
    const expenses = await this.expensesRepository.find({
      where: { groupId },
      relations: ['paidBy', 'splits', 'splits.user'],
    });

    // Calculate balances for each user
    const balanceMap = new Map<string, UserBalanceDto>();

    // Initialize balances for all members
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

    // Calculate totals
    for (const expense of expenses) {
      // Add to total paid
      const payer = balanceMap.get(expense.paidById);
      if (payer) {
        payer.totalPaid += Number(expense.amount);
      }

      // Add to total owed
      for (const split of expense.splits) {
        const debtor = balanceMap.get(split.userId);
        if (debtor) {
          debtor.totalOwed += Number(split.amount);
        }
      }
    }

    // Calculate net balances
    const userBalances: UserBalanceDto[] = [];
    for (const balance of balanceMap.values()) {
      balance.balance = balance.totalPaid - balance.totalOwed;
      userBalances.push(balance);
    }

    // Calculate simplified debts
    const simplifiedDebts = this.simplifyDebts(userBalances);

    return {
      groupId: group.id,
      groupName: group.name,
      currency: group.currency,
      userBalances,
      simplifiedDebts,
    };
  }

  // Helper Methods
  private validateSplits(splits: any[], totalAmount: number): void {
    const splitSum = splits.reduce((sum, split) => sum + Number(split.amount), 0);

    // Allow small floating point differences (0.01)
    if (Math.abs(splitSum - totalAmount) > 0.01) {
      throw new BadRequestException(
        `Split amounts (${splitSum}) must equal the total expense amount (${totalAmount})`,
      );
    }
  }

  private simplifyDebts(userBalances: UserBalanceDto[]): DebtDto[] {
    const debts: DebtDto[] = [];

    // Create arrays of creditors (positive balance) and debtors (negative balance)
    const creditors = userBalances
      .filter((u) => u.balance > 0.01)
      .map((u) => ({ ...u, remaining: u.balance }))
      .sort((a, b) => b.remaining - a.remaining);

    const debtors = userBalances
      .filter((u) => u.balance < -0.01)
      .map((u) => ({ ...u, remaining: Math.abs(u.balance) }))
      .sort((a, b) => b.remaining - a.remaining);

    // Greedy algorithm to minimize transactions
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
          amount: Math.round(amount * 100) / 100, // Round to 2 decimals
        });
      }

      creditor.remaining -= amount;
      debtor.remaining -= amount;

      if (creditor.remaining < 0.01) i++;
      if (debtor.remaining < 0.01) j++;
    }

    return debts;
  }
}
