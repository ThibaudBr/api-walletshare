import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { SubscriptionEntity } from './subscription.entity';

@Entity({ name: 'discount_codes' })
export class DiscountCodeEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'discount_percentage', type: 'int' })
  @IsNotEmpty()
  @IsNumber()
  discountPercentage: number;

  @Column({ name: 'discount_amount', type: 'int' })
  @IsNotEmpty()
  @IsNumber()
  discountAmount: number;

  @Column({ name: 'start_date', type: 'date' })
  @IsDate()
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  @IsDate()
  endDate: Date;

  @Column({ name: 'usage_limit', type: 'int' })
  @IsNotEmpty()
  @IsNumber()
  usageLimit: number;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToMany(() => SubscriptionEntity, subscriptionEntity => subscriptionEntity.discountCodes)
  @JoinTable()
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
