import { Expense } from '../../expenses/entities/expense.entity';
import { User } from '../../users/entities/user.entity';
import { GroupMember } from './group-member.entity';
export declare class Group {
    id: string;
    name: string;
    creatorId: string;
    creator: User;
    description: string;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
    members: GroupMember[];
    expenses: Expense[];
}
