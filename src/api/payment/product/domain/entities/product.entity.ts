import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionEntity } from '../../../../entities-to-create/subscription.entity';
import { PriceEntity } from '../../../price/domain/entities/price.entity';

@Entity({ name: 'plan' })
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ______________________________________________________
  // Properties
  // ______________________________________________________
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;
  @Column({ name: 'description', type: 'varchar', length: 255 })
  description: string;
  @Column({ name: 'stripe_price_id', type: 'varchar', length: 255 })
  stripeProductId: string;
  @Column({ name: 'default_stripe_price_id', type: 'varchar', length: 255 })
  defaultStripePriceId: string;
  @Column({ name: 'json_metadata', type: 'json', nullable: true })
  jsonStripeMetadata: object;
  @Column({ name: 'active', type: 'boolean', default: true })
  active: boolean;
  @OneToMany(() => SubscriptionEntity, subscriptionEntity => subscriptionEntity.plan)
  subscriptions: SubscriptionEntity[];

  // ______________________________________________________
  // Relations
  // ______________________________________________________
  @OneToMany(() => PriceEntity, priceEntity => priceEntity.product)
  prices: PriceEntity[];
  @CreateDateColumn()
  createdAt: Date;

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial?: Partial<ProductEntity>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
