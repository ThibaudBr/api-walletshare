import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { CardEntity } from '../../../card/domain/entities/card.entity';

@Entity({ name: 'message' })
export class MessageEntity extends BaseEntity {
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

  @ManyToOne(() => CardEntity, cardEntity => cardEntity.messages, { onDelete: 'CASCADE' })
  author: CardEntity;

  @ManyToOne(() => ConversationEntity, conversation => conversation.messages)
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

  constructor(partial?: Partial<MessageEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
