import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConnectedCardEntity } from '../../../card/domain/entities/connected-card.entity';
import { GroupEntity } from '../../../groupe/domain/entities/group.entity';
import { JoinedConversationEntity } from './joined-conversation.entity';
import { MessageEntity } from './message.entity';

@Entity({ name: 'conversation' })
export class ConversationEntity extends BaseEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'title' })
  content: string;

  // ______________________________________________________
  // Relations
  // ______________________________________________________
  @OneToOne(() => ConnectedCardEntity, connectedCardEntity => connectedCardEntity.conversation, {nullable: true})
  connectedCard?: ConnectedCardEntity;

  @OneToOne(() => GroupEntity, groupEntity => groupEntity.conversation, { nullable: true })
  group?: GroupEntity;

  @OneToMany(() => MessageEntity, message => message.conversation, {})
  messages: MessageEntity[] = [];

  @OneToMany(() => JoinedConversationEntity, joinedConversation => joinedConversation.conversation)
  joinedProfiles: JoinedConversationEntity[] = [];

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial?: Partial<ConversationEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
    this.joinedProfiles = [];
    this.messages = [];
  }
}
