import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { ExpenseSplit } from './entities/expense-split.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { GroupsService } from '../groups/groups.service';
import { GroupBalanceResponseDto } from './dto/balance-response.dto';
export declare class ExpensesService {
    private readonly expensesRepository;
    private readonly expenseSplitsRepository;
    private readonly groupsService;
    constructor(expensesRepository: Repository<Expense>, expenseSplitsRepository: Repository<ExpenseSplit>, groupsService: GroupsService);
    create(createExpenseDto: CreateExpenseDto, userId: string): Promise<Expense>;
    findAll(groupId: string | undefined, userId: string): Promise<Expense[]>;
    findOne(id: string, userId: string): Promise<Expense>;
    update(id: string, updateExpenseDto: UpdateExpenseDto, userId: string): Promise<Expense>;
    remove(id: string, userId: string): Promise<void>;
    getGroupBalance(groupId: string, userId: string): Promise<GroupBalanceResponseDto>;
    private validateSplits;
    private simplifyDebts;
}
