import { ApiProperty } from '@nestjs/swagger';

export class ExpenseSplitResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;

  @ApiProperty({ example: 'johndoe' })
  username?: string;

  @ApiProperty({ example: 50.0 })
  amount: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;
}

export class ExpenseResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Grocery shopping' })
  description: string;

  @ApiProperty({ example: 150.5 })
  amount: number;

  @ApiProperty({ example: 'TRY' })
  currency: string;

  @ApiProperty({ example: 'Food' })
  category?: string;

  @ApiProperty({ example: '2024-01-15' })
  date: Date;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  paidById: string;

  @ApiProperty({ example: 'johndoe' })
  paidByUsername?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  groupId: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ type: [ExpenseSplitResponseDto], required: false })
  splits?: ExpenseSplitResponseDto[];
}
