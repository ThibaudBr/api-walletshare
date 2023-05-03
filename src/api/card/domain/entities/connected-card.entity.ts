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
import { ConversationEntity } from '../../../entities-to-create/conversation.entity';
import { CardEntity } from './card.entity';

@Entity({ name: 'connected_card' })
export class ConnectedCardEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ______________________________________________________
  // Properties
  // ______________________________________________________
  @OneToOne(() => ConversationEntity, conversation => conversation, {
    cascade: true,
  })
  @JoinColumn()
  conversation: ConversationEntity;

  // ______________________________________________________
  // Relations
  // ______________________________________________________
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
  @CreateDateColumn()
  createdAt: Date;

  // ______________________________________________________
  // Timestamps
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
