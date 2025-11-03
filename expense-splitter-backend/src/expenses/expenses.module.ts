import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { Expense } from './entities/expense.entity';
import { ExpenseSplit } from './entities/expense-split.entity';
import { GroupsModule } from '../groups/groups.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense, ExpenseSplit]),
    GroupsModule,
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
