import { IsString, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({
    example: 'Apartment Expenses',
    description: 'Name of the group',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: 'Shared expenses for our apartment',
    description: 'Optional description of the group',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    example: 'USD',
    description: 'Currency code (default: TRY)',
    default: 'TRY',
  })
  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string;
}
