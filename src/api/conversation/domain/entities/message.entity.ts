import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn,
  ManyToOne, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { CardEntity } from '../../../card/domain/entities/card.entity';
import {MediaEntity} from "../../../media/domain/entities/media.entity";

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

  @OneToOne(() => MediaEntity, media => media.messageMedia, { onDelete: 'CASCADE' })
  @JoinColumn()
  media: MediaEntity;

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
