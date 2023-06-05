import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from '../../../product/domain/entities/product.entity';
import {SubscriptionEntity} from "../../../subscription/domain/entities/subscription.entity";

@Entity('price')
export class PriceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ______________________________________________________
  // Properties
  // ______________________________________________________
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
  unitAmountDecimal: string;
  @Column({ name: 'active', type: 'boolean', default: true })
  active: boolean;
  @Column({ name: 'json_metadata', type: 'json', nullable: true })
  jsonStripeMetadata: object;
  @Column({ name: 'trial_period_days', type: 'int', nullable: true })
  trialPeriodDays: number;

  // ______________________________________________________
  // Relations
  // ______________________________________________________
  @ManyToOne(() => ProductEntity, planEntity => planEntity.prices)
  product: ProductEntity;
  @OneToMany(() => SubscriptionEntity, subscriptionEntity => subscriptionEntity.price)
  subscriptions: SubscriptionEntity[];

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial?: Partial<PriceEntity>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
