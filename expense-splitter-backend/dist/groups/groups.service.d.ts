import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { GroupMember, GroupRole } from './entities/group-member.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddMemberDto } from './dto/add-member.dto';
export declare class GroupsService {
    private readonly groupsRepository;
    private readonly groupMembersRepository;
    constructor(groupsRepository: Repository<Group>, groupMembersRepository: Repository<GroupMember>);
    create(createGroupDto: CreateGroupDto, userId: string): Promise<Group>;
    findAll(userId: string): Promise<Group[]>;
    findOne(id: string, userId: string): Promise<Group>;
    update(id: string, updateGroupDto: UpdateGroupDto, userId: string): Promise<Group>;
    remove(id: string, userId: string): Promise<void>;
    addMember(groupId: string, addMemberDto: AddMemberDto, requestingUserId: string): Promise<GroupMember>;
    removeMember(groupId: string, userId: string, requestingUserId: string): Promise<void>;
    updateMemberRole(groupId: string, userId: string, role: GroupRole, requestingUserId: string): Promise<GroupMember>;
    checkMembership(groupId: string, userId: string): Promise<void>;
    checkAdminRole(groupId: string, userId: string): Promise<void>;
    getMemberRole(groupId: string, userId: string): Promise<GroupRole>;
}
