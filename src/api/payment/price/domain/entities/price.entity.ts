import {
  BaseEntity,
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import {ProductEntity} from "../../../product/domain/entities/product.entity";

@Entity('price')
export class PriceEntity extends BaseEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'price', type: 'float' })
  price: number;

  @Column({ name: 'currency', type: 'varchar', length: 255 })
  currency: string;

  @Column({ name: 'stripe_price_id', type: 'varchar', length: 255 })
  stripePriceId: string;

  @Column({ name: 'interval', type: 'varchar', length: 255 })
  interval: string;

  @Column({ name: 'interval_count', type: 'int' })
  intervalCount: number;

  @Column({ name: 'type', type: 'varchar', length: 255 })
  type: string;

  @Column({ name: 'unit_amount', type: 'float' })
  unitAmount: number;

  @Column({ name: 'unit_amount_decimal', type: 'float' })
  unitAmountDecimal: number;

  @Column({ name: 'active', type: 'boolean', default: true })
  active: boolean;

  @Column({ name: 'json_metadata', type: 'json', nullable: true })
  jsonStripeMetadata: object;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToOne(() => ProductEntity, planEntity => planEntity.prices)
  product: ProductEntity;

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
