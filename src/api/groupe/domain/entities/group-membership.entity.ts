import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GroupEntity } from './group.entity';
import { RoleGroupMembershipEnum } from '../enum/role-group-membership.enum';
import { CardEntity } from '../../../card/domain/entities/card.entity';

@Entity({ name: 'group_membership' })
export class GroupMembershipEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', { array: true, default: RoleGroupMembershipEnum.MEMBER })
  role: RoleGroupMembershipEnum;

  // ______________________________________________________
  // Properties
  // ______________________________________________________
  @ManyToOne(() => CardEntity, cardEntity => cardEntity.groupMemberships, {
    onDelete: 'CASCADE',
  })
  card: CardEntity;

  // ______________________________________________________
  // Relations
  // ______________________________________________________
  @ManyToOne(() => GroupEntity, groupEntity => groupEntity.members, {
    onDelete: 'CASCADE',
  })
  group: GroupEntity;
  @CreateDateColumn()
  createdAt: Date;

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial: Partial<GroupMembershipEntity>) {
    super();
    Object.assign(this, partial);
  }
}
