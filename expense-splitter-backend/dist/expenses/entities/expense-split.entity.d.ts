import { Expense } from './expense.entity';
import { User } from '../../users/entities/user.entity';
export declare class ExpenseSplit {
    id: string;
    amount: number;
    createdAt: Date;
    expenseId: string;
    expense: Expense;
    userId: string;
    user: User;
}
