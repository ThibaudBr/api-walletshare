import {
  BeforeInsert,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, getRepository, JoinColumn,
  ManyToOne, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardEntity } from './card.entity';
import { ConversationEntity } from './conversation.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

@Entity({ name: 'connected-card' })
export class ConnectedCardEntity {
  constructor(partial?: Partial<ConnectedCardEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @OneToOne(() => ConversationEntity, conversation => conversation, {
    cascade: true,
  })
  @JoinColumn()
  conversation: ConversationEntity;

  @ManyToOne(() => CardEntity, cardEntity => cardEntity.connectedCardOne, {
    onDelete: 'CASCADE',
  })
  cardEntityOne: CardEntity;

  @ManyToOne(() => CardEntity, cardEntity => cardEntity.connectedCardTwo, {
    onDelete: 'CASCADE',
  })
  cardEntityTwo: CardEntity;


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
