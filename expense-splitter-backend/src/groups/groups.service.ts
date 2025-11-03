import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { GroupMember, GroupRole } from './entities/group-member.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
    @InjectRepository(GroupMember)
    private readonly groupMembersRepository: Repository<GroupMember>,
  ) {}

  async create(createGroupDto: CreateGroupDto, userId: string): Promise<Group> {
    // Create group
    const group = this.groupsRepository.create({
      ...createGroupDto,
      creatorId: userId,
      currency: createGroupDto.currency || 'TRY',
    });
    const savedGroup = await this.groupsRepository.save(group);

    // Add creator as admin member
    const creatorMember = this.groupMembersRepository.create({
      groupId: savedGroup.id,
      userId: userId,
      role: GroupRole.ADMIN,
    });
    await this.groupMembersRepository.save(creatorMember);

    return savedGroup;
  }

  async findAll(userId: string): Promise<Group[]> {
    // Find all groups where user is a member
    const memberRecords = await this.groupMembersRepository.find({
      where: { userId },
      relations: ['group', 'group.members', 'group.members.user'],
    });

    return memberRecords.map((record) => record.group);
  }

  async findOne(id: string, userId: string): Promise<Group> {
    const group = await this.groupsRepository.findOne({
      where: { id },
      relations: ['members', 'members.user', 'creator'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    // Check if user is a member
    await this.checkMembership(id, userId);

    return group;
  }

  async update(
    id: string,
    updateGroupDto: UpdateGroupDto,
    userId: string,
  ): Promise<Group> {
    const group = await this.findOne(id, userId);

    // Only admins can update group
    await this.checkAdminRole(id, userId);

    Object.assign(group, updateGroupDto);
    return await this.groupsRepository.save(group);
  }

  async remove(id: string, userId: string): Promise<void> {
    const group = await this.findOne(id, userId);

    // Only creator can delete group
    if (group.creatorId !== userId) {
      throw new ForbiddenException(
        'Only the group creator can delete the group',
      );
    }

    await this.groupsRepository.remove(group);
  }

  // Member Management
  async addMember(
    groupId: string,
    addMemberDto: AddMemberDto,
    requestingUserId: string,
  ): Promise<GroupMember> {
    // Check if requesting user is admin
    await this.checkAdminRole(groupId, requestingUserId);

    // Check if user is already a member
    const existingMember = await this.groupMembersRepository.findOne({
      where: { groupId, userId: addMemberDto.userId },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this group');
    }

    const member = this.groupMembersRepository.create({
      groupId,
      userId: addMemberDto.userId,
      role: addMemberDto.role || GroupRole.MEMBER,
    });

    return await this.groupMembersRepository.save(member);
  }

  async removeMember(
    groupId: string,
    userId: string,
    requestingUserId: string,
  ): Promise<void> {
    const group = await this.findOne(groupId, requestingUserId);

    // Cannot remove creator
    if (userId === group.creatorId) {
      throw new ForbiddenException('Cannot remove the group creator');
    }

    // Admin can remove anyone, or user can remove themselves
    if (requestingUserId !== userId) {
      await this.checkAdminRole(groupId, requestingUserId);
    }

    const member = await this.groupMembersRepository.findOne({
      where: { groupId, userId },
    });

    if (!member) {
      throw new NotFoundException('Member not found in this group');
    }

    await this.groupMembersRepository.remove(member);
  }

  async updateMemberRole(
    groupId: string,
    userId: string,
    role: GroupRole,
    requestingUserId: string,
  ): Promise<GroupMember> {
    const group = await this.findOne(groupId, requestingUserId);

    // Only admins can change roles
    await this.checkAdminRole(groupId, requestingUserId);

    // Cannot change creator's role
    if (userId === group.creatorId) {
      throw new ForbiddenException("Cannot change creator's role");
    }

    const member = await this.groupMembersRepository.findOne({
      where: { groupId, userId },
    });

    if (!member) {
      throw new NotFoundException('Member not found in this group');
    }

    member.role = role;
    return await this.groupMembersRepository.save(member);
  }

  // Helper methods
  async checkMembership(groupId: string, userId: string): Promise<void> {
    const member = await this.groupMembersRepository.findOne({
      where: { groupId, userId },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this group');
    }
  }

  async checkAdminRole(groupId: string, userId: string): Promise<void> {
    const member = await this.groupMembersRepository.findOne({
      where: { groupId, userId },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this group');
    }

    if (member.role !== GroupRole.ADMIN) {
      throw new ForbiddenException('Only admins can perform this action');
    }
  }

  async getMemberRole(groupId: string, userId: string): Promise<GroupRole> {
    const member = await this.groupMembersRepository.findOne({
      where: { groupId, userId },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this group');
    }

    return member.role;
  }
}
