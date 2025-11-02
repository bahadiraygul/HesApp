import { ExpenseSplit } from '../../expenses/entities/expense-split.entity';
import { Expense } from '../../expenses/entities/expense.entity';
import { GroupMember } from '../../groups/entities/group-member.entity';
export declare class User {
    id: string;
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
    groupMemerships: GroupMember[];
    paidExpenses: Expense[];
    expenseSplits: ExpenseSplit[];
}
