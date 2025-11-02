import { User } from "../../users/entities/user.entity";
import { Group } from "./group.entity";
export declare enum GroupRole {
    ADMIN = "admin",
    MEMBER = "member"
}
export declare class GroupMember {
    id: string;
    userId: string;
    user: User;
    groupId: string;
    group: Group;
    role: GroupRole;
    joinedAt: Date;
}
