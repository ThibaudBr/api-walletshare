import {
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
import { PlanEntity } from './plan.entity';
import { UserEntity } from './user.entity';
import { InvoicesEntity } from './invoices.entity';
import { DiscountCodeEntity } from './discount-code.entity';

@Entity({ name: 'subscription' })
export class SubscriptionEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'start_date', type: 'date' })
  @IsDate()
  public startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  @IsDate()
  public endDate: Date;

  // @Column({ type: 'enum', enum: StatusSubscriptionEnum, default: StatusSubscriptionEnum.ACTIVE })
  // public status: StatusSubscriptionEnum;

  /**
   * @description
   * This is a flag to indicate if the user has a stripe customer id.
   */
  @Column({ unique: true, nullable: true })
  public stripCustomerId?: string;

  @Column({ name: 'trial_start_date', type: 'date', nullable: true })
  @IsDate()
  public trialStartDate?: Date;

  @Column({ name: 'trial_end_date', type: 'date', nullable: true })
  @IsDate()
  public trialEndDate?: Date;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToOne(() => PlanEntity, planEntity => planEntity.subscriptions)
  public plan: PlanEntity;

  @ManyToOne(() => UserEntity, userEntity => userEntity.subscriptions)
  user: UserEntity;

  @OneToMany(() => InvoicesEntity, invoicesEntity => invoicesEntity.subscription)
  invoices: InvoicesEntity[];

  @ManyToMany(() => DiscountCodeEntity, discountCodeEntity => discountCodeEntity.subscriptions)
  discountCodes: DiscountCodeEntity[];

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
