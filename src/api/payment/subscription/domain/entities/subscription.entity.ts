import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate } from 'class-validator';
import { UserEntity } from '../../../../user/domain/entities/user.entity';
import { InvoicesEntity } from '../../../invoices/domain/entities/invoices.entity';
import { StatusSubscriptionEnum } from '../enum/status-subscription.enum';
import { PriceEntity } from '../../../price/domain/entities/price.entity';
import { ReferralCodeEntity } from '../../../../user/domain/entities/referral-code.entity';

@Entity({ name: 'subscription' })
export class SubscriptionEntity extends BaseEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'start_date', type: 'date' })
  @IsDate()
  public startDate: Date;

  @Column({ type: 'enum', enum: StatusSubscriptionEnum, default: StatusSubscriptionEnum.ACTIVE })
  public status: StatusSubscriptionEnum;

  @Column({ name: 'trial_start_date', type: 'date', nullable: true })
  @IsDate()
  public trialStartDate?: Date;

  @Column({ name: 'trial_end_date', type: 'date', nullable: true })
  @IsDate()
  public trialEndDate?: Date;

  @Column({ name: 'subscription_stripe_id', type: 'varchar', nullable: true })
  public subscriptionStripeId?: string;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToOne(() => PriceEntity, priceEntity => priceEntity.subscriptions)
  price: PriceEntity;

  @ManyToOne(() => UserEntity, userEntity => userEntity.subscriptions)
  user: UserEntity;

  @OneToMany(() => InvoicesEntity, invoicesEntity => invoicesEntity.subscription)
  invoices: InvoicesEntity[];

  @ManyToOne(() => ReferralCodeEntity, referralCodeEntity => referralCodeEntity.subscriptions)
  referralCode: ReferralCodeEntity;

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial?: Partial<SubscriptionEntity>) {
    super();
    Object.assign(this, partial);
  }
}
