import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('groups')
@Controller('groups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({
    status: 201,
    description: 'Group created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @CurrentUser() user: User,
  ) {
    return await this.groupsService.create(createGroupDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all groups where user is a member' })
  @ApiResponse({
    status: 200,
    description: 'List of groups retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@CurrentUser() user: User) {
    return await this.groupsService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific group by ID' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({
    status: 200,
    description: 'Group details retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiResponse({ status: 403, description: 'Not a member of this group' })
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.groupsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update group details (admin only)' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({
    status: 200,
    description: 'Group updated successfully',
  })
  @ApiResponse({ status: 403, description: 'Only admins can update group' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @CurrentUser() user: User,
  ) {
    return await this.groupsService.update(id, updateGroupDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a group (creator only)' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({
    status: 204,
    description: 'Group deleted successfully',
  })
  @ApiResponse({ status: 403, description: 'Only creator can delete group' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    await this.groupsService.remove(id, user.id);
  }

  // Member Management Endpoints
  @Post(':id/members')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a member to the group (admin only)' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({
    status: 201,
    description: 'Member added successfully',
  })
  @ApiResponse({ status: 403, description: 'Only admins can add members' })
  @ApiResponse({ status: 409, description: 'User already a member' })
  async addMember(
    @Param('id') id: string,
    @Body() addMemberDto: AddMemberDto,
    @CurrentUser() user: User,
  ) {
    return await this.groupsService.addMember(id, addMemberDto, user.id);
  }

  @Delete(':groupId/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove a member from the group (admin only or self)',
  })
  @ApiParam({ name: 'groupId', description: 'Group ID' })
  @ApiParam({ name: 'userId', description: 'User ID to remove' })
  @ApiResponse({
    status: 204,
    description: 'Member removed successfully',
  })
  @ApiResponse({ status: 403, description: 'Permission denied' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async removeMember(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: User,
  ) {
    await this.groupsService.removeMember(groupId, userId, user.id);
  }

  @Patch(':groupId/members/:userId/role')
  @ApiOperation({ summary: 'Update member role (admin only)' })
  @ApiParam({ name: 'groupId', description: 'Group ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Member role updated successfully',
  })
  @ApiResponse({ status: 403, description: 'Only admins can change roles' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async updateMemberRole(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Body() updateMemberRoleDto: UpdateMemberRoleDto,
    @CurrentUser() user: User,
  ) {
    return await this.groupsService.updateMemberRole(
      groupId,
      userId,
      updateMemberRoleDto.role,
      user.id,
    );
  }
}
