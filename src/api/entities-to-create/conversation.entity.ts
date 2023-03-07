import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConnectedCardEntity } from './connected-card.entity';
import { GroupEntity } from './group.entity';
import { JoinedConversation } from './joined-conversation.entity';

@Entity({ name: 'conversation' })
export class ConversationEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => ConnectedCardEntity, connectedCardEntity => connectedCardEntity.conversation)
  connectedCard: ConnectedCardEntity;

  @OneToMany(() => GroupEntity, groupEntity => groupEntity.conversations)
  group: GroupEntity[];

  @OneToMany(() => Message, message => message.conversation, {})
  messages: Message[];

  @OneToMany(() => JoinedConversation, joinedConversation => joinedConversation.conversation)
  joinedProfiles: JoinedConversation[];

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
