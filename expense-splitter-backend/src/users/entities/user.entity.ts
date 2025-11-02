import { Exclude } from 'class-transformer';
import { ExpenseSplit } from '../../expenses/entities/expense-split.entity';
import { Expense } from '../../expenses/entities/expense.entity';
import { GroupMember } from '../../groups/entities/group-member.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => GroupMember, (groupMember) => groupMember.user)
  groupMemerships: GroupMember[];

  @OneToMany(() => Expense, (expense) => expense.paidBy)
  paidExpenses: Expense[];

  @OneToMany(() => ExpenseSplit, (expenseSplit) => expenseSplit.user)
  expenseSplits: ExpenseSplit[];
}
