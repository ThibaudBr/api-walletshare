import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConversationEntity } from '../../../conversation/domain/entities/conversation.entity';
import { CardEntity } from './card.entity';

@Entity({ name: 'connected_card' })
export class ConnectedCardEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ______________________________________________________
  // Properties
  // ______________________________________________________

  // ______________________________________________________
  // Relations
  // ______________________________________________________
  @OneToOne(() => ConversationEntity, conversation => conversation.connectedCard, {
    cascade: true,
  })
  @JoinColumn()
  conversation: ConversationEntity;

  @ManyToOne(() => CardEntity, cardEntity => cardEntity.connectedCardOne, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  cardEntityOne: CardEntity;
  @ManyToOne(() => CardEntity, cardEntity => cardEntity.connectedCardTwo, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
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

  constructor(partial?: Partial<ConnectedCardEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
