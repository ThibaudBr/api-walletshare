import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionEntity } from './subscription.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'plan' })
export class PlanEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 255 })
  description: string;

  @Column({ name: 'price', type: 'float' })
  price: number;

  @Column({ name: 'duration', type: 'int' })
  duration: number;

  @Column({ name: 'discounted_price', type: 'float' })
  discountedPrice: number;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @OneToMany(() => SubscriptionEntity, subscriptionEntity => subscriptionEntity.plan)
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
}
