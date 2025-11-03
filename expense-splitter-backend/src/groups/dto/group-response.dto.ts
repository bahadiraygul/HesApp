import { ApiProperty } from '@nestjs/swagger';
import { GroupRole } from '../entities/group-member.entity';

export class GroupMemberResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;

  @ApiProperty({ example: 'johndoe' })
  username?: string;

  @ApiProperty({ example: 'John Doe' })
  fullName?: string;

  @ApiProperty({ example: 'admin', enum: GroupRole })
  role: GroupRole;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  joinedAt: Date;
}

export class GroupResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Apartment Expenses' })
  name: string;

  @ApiProperty({ example: 'Shared expenses for our apartment' })
  description?: string;

  @ApiProperty({ example: 'TRY' })
  currency: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  creatorId: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ type: [GroupMemberResponseDto], required: false })
  members?: GroupMemberResponseDto[];
}
