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
import {PriceEntity} from "../../../price/domain/entities/price.entity";

@Entity({ name: 'plan' })
export class ProductEntity extends BaseEntity {
  constructor(partial?: Partial<ProductEntity>) {
    super();
    if (partial) Object.assign(this, partial);
  }
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @OneToMany(() => SubscriptionEntity, subscriptionEntity => subscriptionEntity.plan)
  subscriptions: SubscriptionEntity[];

  @OneToMany(() => PriceEntity, priceEntity => priceEntity.product)
  prices: PriceEntity[];

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
