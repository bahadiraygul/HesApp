import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./group.entity";


export enum GroupRole{
    ADMIN = 'admin',
    MEMBER = 'member',
}

@Entity('group_members')
export class GroupMember {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId : string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user : User;

    @Column()
    groupId : string;

    @ManyToOne(() => Group)
    @JoinColumn({ name: 'groupId' })
    group : Group;

    @Column({
        type: 'enum',
        enum: GroupRole,
        default: GroupRole.MEMBER,
    })
    role : GroupRole;

    @CreateDateColumn()
    joinedAt : Date;
}

