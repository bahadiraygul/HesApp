import { GroupRole } from '../entities/group-member.entity';
export declare class GroupMemberResponseDto {
    id: string;
    userId: string;
    username?: string;
    fullName?: string;
    role: GroupRole;
    joinedAt: Date;
}
export declare class GroupResponseDto {
    id: string;
    name: string;
    description?: string;
    currency: string;
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
    members?: GroupMemberResponseDto[];
}
