"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const group_entity_1 = require("./entities/group.entity");
const group_member_entity_1 = require("./entities/group-member.entity");
let GroupsService = class GroupsService {
    groupsRepository;
    groupMembersRepository;
    constructor(groupsRepository, groupMembersRepository) {
        this.groupsRepository = groupsRepository;
        this.groupMembersRepository = groupMembersRepository;
    }
    async create(createGroupDto, userId) {
        const group = this.groupsRepository.create({
            ...createGroupDto,
            creatorId: userId,
            currency: createGroupDto.currency || 'TRY',
        });
        const savedGroup = await this.groupsRepository.save(group);
        const creatorMember = this.groupMembersRepository.create({
            groupId: savedGroup.id,
            userId: userId,
            role: group_member_entity_1.GroupRole.ADMIN,
        });
        await this.groupMembersRepository.save(creatorMember);
        return savedGroup;
    }
    async findAll(userId) {
        const memberRecords = await this.groupMembersRepository.find({
            where: { userId },
            relations: ['group', 'group.members', 'group.members.user'],
        });
        return memberRecords.map((record) => record.group);
    }
    async findOne(id, userId) {
        const group = await this.groupsRepository.findOne({
            where: { id },
            relations: ['members', 'members.user', 'creator'],
        });
        if (!group) {
            throw new common_1.NotFoundException(`Group with ID ${id} not found`);
        }
        await this.checkMembership(id, userId);
        return group;
    }
    async update(id, updateGroupDto, userId) {
        const group = await this.findOne(id, userId);
        await this.checkAdminRole(id, userId);
        Object.assign(group, updateGroupDto);
        return await this.groupsRepository.save(group);
    }
    async remove(id, userId) {
        const group = await this.findOne(id, userId);
        if (group.creatorId !== userId) {
            throw new common_1.ForbiddenException('Only the group creator can delete the group');
        }
        await this.groupsRepository.remove(group);
    }
    async addMember(groupId, addMemberDto, requestingUserId) {
        await this.checkAdminRole(groupId, requestingUserId);
        const existingMember = await this.groupMembersRepository.findOne({
            where: { groupId, userId: addMemberDto.userId },
        });
        if (existingMember) {
            throw new common_1.ConflictException('User is already a member of this group');
        }
        const member = this.groupMembersRepository.create({
            groupId,
            userId: addMemberDto.userId,
            role: addMemberDto.role || group_member_entity_1.GroupRole.MEMBER,
        });
        return await this.groupMembersRepository.save(member);
    }
    async removeMember(groupId, userId, requestingUserId) {
        const group = await this.findOne(groupId, requestingUserId);
        if (userId === group.creatorId) {
            throw new common_1.ForbiddenException('Cannot remove the group creator');
        }
        if (requestingUserId !== userId) {
            await this.checkAdminRole(groupId, requestingUserId);
        }
        const member = await this.groupMembersRepository.findOne({
            where: { groupId, userId },
        });
        if (!member) {
            throw new common_1.NotFoundException('Member not found in this group');
        }
        await this.groupMembersRepository.remove(member);
    }
    async updateMemberRole(groupId, userId, role, requestingUserId) {
        const group = await this.findOne(groupId, requestingUserId);
        await this.checkAdminRole(groupId, requestingUserId);
        if (userId === group.creatorId) {
            throw new common_1.ForbiddenException("Cannot change creator's role");
        }
        const member = await this.groupMembersRepository.findOne({
            where: { groupId, userId },
        });
        if (!member) {
            throw new common_1.NotFoundException('Member not found in this group');
        }
        member.role = role;
        return await this.groupMembersRepository.save(member);
    }
    async checkMembership(groupId, userId) {
        const member = await this.groupMembersRepository.findOne({
            where: { groupId, userId },
        });
        if (!member) {
            throw new common_1.ForbiddenException('You are not a member of this group');
        }
    }
    async checkAdminRole(groupId, userId) {
        const member = await this.groupMembersRepository.findOne({
            where: { groupId, userId },
        });
        if (!member) {
            throw new common_1.ForbiddenException('You are not a member of this group');
        }
        if (member.role !== group_member_entity_1.GroupRole.ADMIN) {
            throw new common_1.ForbiddenException('Only admins can perform this action');
        }
    }
    async getMemberRole(groupId, userId) {
        const member = await this.groupMembersRepository.findOne({
            where: { groupId, userId },
        });
        if (!member) {
            throw new common_1.ForbiddenException('You are not a member of this group');
        }
        return member.role;
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(group_entity_1.Group)),
    __param(1, (0, typeorm_1.InjectRepository)(group_member_entity_1.GroupMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], GroupsService);
//# sourceMappingURL=groups.service.js.map