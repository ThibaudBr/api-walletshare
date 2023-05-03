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
  @OneToMany(() => GroupMembershipEntity, groupMembership => groupMembership.group, { cascade: true })
  members: GroupMembershipEntity[];

  // ______________________________________________________
  // Relations
  // ______________________________________________________
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
