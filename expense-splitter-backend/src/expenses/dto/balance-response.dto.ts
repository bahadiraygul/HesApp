import { ApiProperty } from '@nestjs/swagger';

export class UserBalanceDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ example: 250.0, description: 'Total amount paid by this user' })
  totalPaid: number;

  @ApiProperty({ example: 150.0, description: 'Total amount owed by this user' })
  totalOwed: number;

  @ApiProperty({
    example: 100.0,
    description: 'Net balance (positive means others owe this user, negative means this user owes others)',
  })
  balance: number;
}

export class DebtDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  fromUserId: string;

  @ApiProperty({ example: 'johndoe' })
  fromUsername: string;

  @ApiProperty({ example: '660e8400-e29b-41d4-a716-446655440001' })
  toUserId: string;

  @ApiProperty({ example: 'janedoe' })
  toUsername: string;

  @ApiProperty({ example: 50.0 })
  amount: number;
}

export class GroupBalanceResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  groupId: string;

  @ApiProperty({ example: 'Apartment Expenses' })
  groupName: string;

  @ApiProperty({ example: 'TRY' })
  currency: string;

  @ApiProperty({ type: [UserBalanceDto] })
  userBalances: UserBalanceDto[];

  @ApiProperty({ type: [DebtDto], description: 'Simplified debts (optimized settlements)' })
  simplifiedDebts: DebtDto[];
}
