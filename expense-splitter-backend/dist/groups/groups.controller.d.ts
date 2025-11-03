import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { User } from '../users/entities/user.entity';
export declare class GroupsController {
    private readonly groupsService;
    constructor(groupsService: GroupsService);
    create(createGroupDto: CreateGroupDto, user: User): Promise<import("./entities/group.entity").Group>;
    findAll(user: User): Promise<import("./entities/group.entity").Group[]>;
    findOne(id: string, user: User): Promise<import("./entities/group.entity").Group>;
    update(id: string, updateGroupDto: UpdateGroupDto, user: User): Promise<import("./entities/group.entity").Group>;
    remove(id: string, user: User): Promise<void>;
    addMember(id: string, addMemberDto: AddMemberDto, user: User): Promise<import("./entities/group-member.entity").GroupMember>;
    removeMember(groupId: string, userId: string, user: User): Promise<void>;
    updateMemberRole(groupId: string, userId: string, updateMemberRoleDto: UpdateMemberRoleDto, user: User): Promise<import("./entities/group-member.entity").GroupMember>;
}
