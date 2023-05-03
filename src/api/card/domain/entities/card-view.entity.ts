import { BaseEntity, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CardEntity } from './card.entity';

@Entity({ name: 'card_view' })
export class CardViewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ______________________________________________________
  // Properties
  // ______________________________________________________
  @ManyToOne(() => CardEntity, card => card.cardViews, {
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
  })
  card: CardEntity;

  // ______________________________________________________
  // Relations
  // ______________________________________________________
  @CreateDateColumn()
  createdAt: Date;

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________
  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial: Partial<CardViewEntity>) {
    super();
    Object.assign(this, partial);
  }
}
