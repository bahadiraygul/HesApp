import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GroupRole } from '../entities/group-member.entity';

export class AddMemberDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User ID to add to the group',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({
    example: 'member',
    description: 'Role of the member (admin or member)',
    enum: GroupRole,
    default: GroupRole.MEMBER,
  })
  @IsEnum(GroupRole)
  @IsOptional()
  role?: GroupRole;
}
