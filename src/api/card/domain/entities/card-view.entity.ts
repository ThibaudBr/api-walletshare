import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CardEntity } from './card.entity';

@Entity({ name: 'card_view' })
export class CardViewEntity extends BaseEntity {
  constructor(partial: Partial<CardViewEntity>) {
    super();
    Object.assign(this, partial);
  }

  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToOne(() => CardEntity, card => card.cardViews, {
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
  })
  card: CardEntity;

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
