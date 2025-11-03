export declare class ExpenseSplitResponseDto {
    id: string;
    userId: string;
    username?: string;
    amount: number;
    createdAt: Date;
}
export declare class ExpenseResponseDto {
    id: string;
    description: string;
    amount: number;
    currency: string;
    category?: string;
    date: Date;
    paidById: string;
    paidByUsername?: string;
    groupId: string;
    createdAt: Date;
    updatedAt: Date;
    splits?: ExpenseSplitResponseDto[];
}
