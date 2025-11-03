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
exports.GroupsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const groups_service_1 = require("./groups.service");
const create_group_dto_1 = require("./dto/create-group.dto");
const update_group_dto_1 = require("./dto/update-group.dto");
const add_member_dto_1 = require("./dto/add-member.dto");
const update_member_role_dto_1 = require("./dto/update-member-role.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let GroupsController = class GroupsController {
    groupsService;
    constructor(groupsService) {
        this.groupsService = groupsService;
    }
    async create(createGroupDto, user) {
        return await this.groupsService.create(createGroupDto, user.id);
    }
    async findAll(user) {
        return await this.groupsService.findAll(user.id);
    }
    async findOne(id, user) {
        return await this.groupsService.findOne(id, user.id);
    }
    async update(id, updateGroupDto, user) {
        return await this.groupsService.update(id, updateGroupDto, user.id);
    }
    async remove(id, user) {
        await this.groupsService.remove(id, user.id);
    }
    async addMember(id, addMemberDto, user) {
        return await this.groupsService.addMember(id, addMemberDto, user.id);
    }
    async removeMember(groupId, userId, user) {
        await this.groupsService.removeMember(groupId, userId, user.id);
    }
    async updateMemberRole(groupId, userId, updateMemberRoleDto, user) {
        return await this.groupsService.updateMemberRole(groupId, userId, updateMemberRoleDto.role, user.id);
    }
};
exports.GroupsController = GroupsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new group' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Group created successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_group_dto_1.CreateGroupDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all groups where user is a member' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of groups retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific group by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Group ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Group details retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Group not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not a member of this group' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update group details (admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Group ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Group updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only admins can update group' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Group not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_group_dto_1.UpdateGroupDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a group (creator only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Group ID' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Group deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only creator can delete group' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Group not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Add a member to the group (admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Group ID' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Member added successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only admins can add members' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User already a member' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_member_dto_1.AddMemberDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)(':groupId/members/:userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove a member from the group (admin only or self)',
    }),
    (0, swagger_1.ApiParam)({ name: 'groupId', description: 'Group ID' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID to remove' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Member removed successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Permission denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Member not found' }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Patch)(':groupId/members/:userId/role'),
    (0, swagger_1.ApiOperation)({ summary: 'Update member role (admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'groupId', description: 'Group ID' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Member role updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only admins can change roles' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Member not found' }),
    __param(0, (0, common_1.Param)('groupId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_member_role_dto_1.UpdateMemberRoleDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], GroupsController.prototype, "updateMemberRole", null);
exports.GroupsController = GroupsController = __decorate([
    (0, swagger_1.ApiTags)('groups'),
    (0, common_1.Controller)('groups'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [groups_service_1.GroupsService])
], GroupsController);
//# sourceMappingURL=groups.controller.js.map