import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { User } from '../users/entities/user.entity';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    create(createExpenseDto: CreateExpenseDto, user: User): Promise<import("./entities/expense.entity").Expense>;
    findAll(groupId: string, user: User): Promise<import("./entities/expense.entity").Expense[]>;
    findOne(id: string, user: User): Promise<import("./entities/expense.entity").Expense>;
    update(id: string, updateExpenseDto: UpdateExpenseDto, user: User): Promise<import("./entities/expense.entity").Expense>;
    remove(id: string, user: User): Promise<void>;
    getGroupBalance(groupId: string, user: User): Promise<import("./dto/balance-response.dto").GroupBalanceResponseDto>;
}
