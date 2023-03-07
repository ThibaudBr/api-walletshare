import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { ConversationEntity } from './conversation.entity';

@Entity()
export class JoinedConversation {
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
}
