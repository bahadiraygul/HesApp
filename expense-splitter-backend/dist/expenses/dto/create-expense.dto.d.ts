export declare class SplitDto {
    userId: string;
    amount: number;
}
export declare class CreateExpenseDto {
    description: string;
    amount: number;
    currency?: string;
    category?: string;
    date: string;
    groupId: string;
    splits: SplitDto[];
}
