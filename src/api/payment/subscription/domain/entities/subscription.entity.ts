import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  @Column({ name: 'current_period_start', type: 'date' })
  @IsDate()
  public currentPeriodStart: Date;

  @Column({ name: 'current_period_end', type: 'date' })
  @IsDate()
  public currentPeriodEnd: Date;

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

  @Column({ name: 'stripe_latest_invoice_id', type: 'varchar', nullable: true })
  stripeLatestInvoiceId?: string;

  @Column({ name: 'profile_owner_id', type: 'varchar', nullable: true })
  public profileOwnerId?: string;

  @Column({ name: 'profile_employee_id', array: true, type: 'text', default: [] })
  public profileEmployeeIds: string[] = [];

  @Column({ name: 'canceled_at', type: 'date', nullable: true })
  @IsDate()
  public canceledAt?: Date;

  @Column({ name: 'cancel_at_period_end', type: 'boolean', default: false })
  public cancelAtPeriodEnd: boolean;

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
    this.profileEmployeeIds = [];
    Object.assign(this, partial);
  }
}
