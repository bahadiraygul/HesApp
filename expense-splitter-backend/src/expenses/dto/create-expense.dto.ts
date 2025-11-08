import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  IsDateString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SplitDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User ID who owes this split',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 50.0,
    description: 'Amount this user owes',
  })
  @IsNumber()
  @Min(0.01)
  amount: number;
}

export class CreateExpenseDto {
  @ApiProperty({
    example: 'Grocery shopping',
    description: 'Description of the expense',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @ApiProperty({
    example: 150.5,
    description: 'Total amount of the expense',
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({
    example: 'USD',
    description: 'Currency code (default: TRY)',
    default: 'TRY',
  })
  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({
    example: 'Food',
    description: 'Category of the expense',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  category?: string;

  @ApiProperty({
    example: '2024-01-15',
    description: 'Date of the expense',
  })
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Group ID this expense belongs to',
  })
  @IsUUID()
  @IsNotEmpty()
  groupId: string;

  @ApiProperty({
    type: [SplitDto],
    description: 'How the expense is split among users',
    example: [
      { userId: '550e8400-e29b-41d4-a716-446655440000', amount: 75.25 },
      { userId: '660e8400-e29b-41d4-a716-446655440001', amount: 75.25 },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SplitDto)
  splits: SplitDto[];
}
