import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { CardEntity } from './card.entity';

@Entity({ name: 'message' })
export class MessageEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  public content: string;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToOne(() => CardEntity, cardEntity => cardEntity.messages, { onDelete: 'CASCADE' })
  public author: CardEntity;

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
}
