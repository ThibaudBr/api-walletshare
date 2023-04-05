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
import { MediaEntity } from '../../../entities-to-create/media.entity';
import { GroupMembershipEntity } from './group-membership.entity';
import { GroupRequestEntity } from './group-request.entity';

@Entity({ name: 'group' })
export class GroupEntity extends BaseEntity {
  constructor(partial: Partial<GroupEntity>) {
    super();
    Object.assign(this, partial);
  }
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @OneToOne(() => MediaEntity, media => media.groupPicture, {
    cascade: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  picture: MediaEntity;

  @OneToOne(() => MediaEntity, media => media.groupBannerPicture, {
    cascade: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  bannerPicture: MediaEntity;

  @OneToMany(() => GroupRequestEntity, groupRequest => groupRequest.group, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  groupRequests: GroupRequestEntity[];

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
