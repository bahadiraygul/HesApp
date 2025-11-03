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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('expenses')
@Controller('expenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({
    status: 201,
    description: 'Expense created successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation error or invalid splits' })
  @ApiResponse({ status: 403, description: 'Not a member of the group' })
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
    @CurrentUser() user: User,
  ) {
    return await this.expensesService.create(createExpenseDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses for a group' })
  @ApiQuery({ name: 'groupId', description: 'Group ID to filter expenses' })
  @ApiResponse({
    status: 200,
    description: 'List of expenses retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Not a member of the group' })
  async findAll(@Query('groupId') groupId: string, @CurrentUser() user: User) {
    return await this.expensesService.findAll(groupId, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific expense by ID' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  @ApiResponse({
    status: 200,
    description: 'Expense details retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  @ApiResponse({ status: 403, description: 'Not a member of the group' })
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.expensesService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an expense (payer only)' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  @ApiResponse({
    status: 200,
    description: 'Expense updated successfully',
  })
  @ApiResponse({ status: 403, description: 'Only the payer can update this expense' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @CurrentUser() user: User,
  ) {
    return await this.expensesService.update(id, updateExpenseDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an expense (payer only)' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  @ApiResponse({
    status: 204,
    description: 'Expense deleted successfully',
  })
  @ApiResponse({ status: 403, description: 'Only the payer can delete this expense' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    await this.expensesService.remove(id, user.id);
  }

  @Get('groups/:groupId/balance')
  @ApiOperation({
    summary: 'Get group balance and simplified settlement debts',
  })
  @ApiParam({ name: 'groupId', description: 'Group ID' })
  @ApiResponse({
    status: 200,
    description: 'Group balance calculated successfully',
  })
  @ApiResponse({ status: 403, description: 'Not a member of the group' })
  async getGroupBalance(
    @Param('groupId') groupId: string,
    @CurrentUser() user: User,
  ) {
    return await this.expensesService.getGroupBalance(groupId, user.id);
  }
}
