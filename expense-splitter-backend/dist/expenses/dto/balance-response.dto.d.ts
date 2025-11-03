export declare class UserBalanceDto {
    userId: string;
    username: string;
    fullName: string;
    totalPaid: number;
    totalOwed: number;
    balance: number;
}
export declare class DebtDto {
    fromUserId: string;
    fromUsername: string;
    toUserId: string;
    toUsername: string;
    amount: number;
}
export declare class GroupBalanceResponseDto {
    groupId: string;
    groupName: string;
    currency: string;
    userBalances: UserBalanceDto[];
    simplifiedDebts: DebtDto[];
}
