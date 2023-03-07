import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardEntity } from './card.entity';
import { GroupEntity } from './group.entity';
import { RoleGroupMembershipEnum } from './enum/role-group-membership.enum';
import { TypeOfCardEnum } from './enum/type-of-card.enum';

@Entity()
export class GroupMembershipEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @Column('text', { array: true, default: [RoleGroupMembershipEnum.MEMBER] })
  role: RoleGroupMembershipEnum;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToOne(() => CardEntity, cardEntity => cardEntity.groupMemberships, {
    onDelete: 'CASCADE',

  })
  card: CardEntity;

  @ManyToOne(() => GroupEntity, groupEntity => groupEntity.members, {
    onDelete: 'CASCADE',
  })
  group: GroupEntity;

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
