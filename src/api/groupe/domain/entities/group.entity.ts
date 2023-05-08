import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Length } from 'class-validator';
import { ConversationEntity } from '../../../entities-to-create/conversation.entity';
import { MediaEntity } from '../../../media/domain/entities/media.entity';
import { GroupMembershipEntity } from './group-membership.entity';

@Entity({ name: 'group' })
export class GroupEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ______________________________________________________
  // Properties
  // ______________________________________________________
  @Length(5, 30)
  @Column({ nullable: false, unique: true })
  name: string;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @OneToMany(() => GroupMembershipEntity, groupMembership => groupMembership.group, { cascade: true })
  members: GroupMembershipEntity[];

  @OneToMany(() => ConversationEntity, conversation => conversation.group, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn()
  conversations: ConversationEntity[];
  @OneToOne(() => MediaEntity, media => media.avatarGroupMedia, {
    cascade: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  avatarMedia: MediaEntity;
  @OneToOne(() => MediaEntity, media => media.bannerGroupMedia, {
    cascade: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  bannerMedia: MediaEntity;

  @CreateDateColumn()
  createdAt: Date;

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial: Partial<GroupEntity>) {
    super();
    Object.assign(this, partial);
  }
}
