import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConnectedCardEntity } from '../card/domain/entities/connected-card.entity';
import { GroupEntity } from '../groupe/domain/entities/group.entity';
import { JoinedConversation } from './joined-conversation.entity';
import { MessageEntity } from './message.entity';
import { NotificationEntity } from './notification.entity';

@Entity({ name: 'conversation' })
export class ConversationEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  // ______________________________________________________
  // Relations
  // ______________________________________________________
  @OneToOne(() => ConnectedCardEntity, connectedCardEntity => connectedCardEntity.conversation)
  connectedCard: ConnectedCardEntity;

  @OneToMany(() => GroupEntity, groupEntity => groupEntity.conversations)
  group: GroupEntity[];

  @OneToMany(() => MessageEntity, message => message.conversation, {})
  messages: MessageEntity[];

  @OneToMany(() => JoinedConversation, joinedConversation => joinedConversation.conversation)
  joinedProfiles: JoinedConversation[];

  @OneToMany(() => NotificationEntity, notification => notification.conversation, { nullable: true })
  notifications: NotificationEntity[];

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
