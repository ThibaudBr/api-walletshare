import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, UpdateDateColumn } from 'typeorm';
import { CardEntity } from './card.entity';
import { GroupEntity } from './group.entity';
import { RoleGroupMembershipEnum } from './enum/role-group-membership.enum';

@Entity()
export class GroupMembership {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @Column({ type: 'enum', enum: RoleGroupMembershipEnum, default: RoleGroupMembershipEnum.MEMBER })
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
