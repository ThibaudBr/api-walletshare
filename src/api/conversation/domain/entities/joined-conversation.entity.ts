import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProfileEntity } from '../../../profile/domain/entities/profile.entity';
import { ConversationEntity } from './conversation.entity';

@Entity({ name: 'joined_conversation' })
export class JoinedConversationEntity extends BaseEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  socketId: string;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToOne(() => ProfileEntity, profileEntity => profileEntity.joinedConversations)
  @JoinColumn()
  profile: ProfileEntity;

  @ManyToOne(() => ConversationEntity, conversation => conversation.joinedProfiles)
  @JoinColumn()
  conversation: ConversationEntity;

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial?: Partial<JoinedConversationEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
