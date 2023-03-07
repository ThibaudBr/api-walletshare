import {
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
import { ConversationEntity } from './conversation.entity';
import { MediaEntity } from './media.entity';
import { GroupMembership } from './group-membership.entity';

@Entity()
export class GroupEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Length(5, 30)
  @Column({ nullable: false, unique: true })
  name: string;
  @OneToMany(() => GroupMembership, groupMembership => groupMembership.group, { cascade: true })
  members: GroupMembership[];

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
