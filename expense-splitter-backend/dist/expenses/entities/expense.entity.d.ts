import { Group } from '../../groups/entities/group.entity';
import { User } from '../../users/entities/user.entity';
import { ExpenseSplit } from './expense-split.entity';
export declare class Expense {
    id: string;
    description: string;
    amount: number;
    currency: string;
    category: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
    paidById: string;
    paidBy: User;
    groupId: string;
    group: Group;
    splits: ExpenseSplit[];
}
