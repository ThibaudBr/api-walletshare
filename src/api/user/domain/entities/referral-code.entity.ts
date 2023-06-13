import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionEntity } from '../../../payment/subscription/domain/entities/subscription.entity';
import { UserEntity } from './user.entity';

@Entity('referral_code')
export class ReferralCodeEntity extends BaseEntity {
  @ApiProperty({ example: 'eb823d92-bf55-4210-8e24-89f4011bb96d' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  public referralCodeString?: string;

  @Column({ nullable: true })
  public stripeId?: string;

  @ApiProperty({ type: () => UserEntity })
  @OneToMany(() => UserEntity, user => user.usedReferralCodes)
  usedBy: UserEntity[];

  @ApiProperty({ type: () => UserEntity })
  @OneToOne(() => UserEntity, user => user.referralCode, {
    eager: false,
  })
  owner: UserEntity;

  @ApiProperty({ type: () => SubscriptionEntity, required: false })
  @OneToMany(() => SubscriptionEntity, subscription => subscription.referralCode, { nullable: true })
  subscriptions: SubscriptionEntity[];

  @ApiProperty({ type: () => Date })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: () => Date })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => Date, required: false })
  @DeleteDateColumn()
  deletedAt?: Date;

  constructor(partial: Partial<ReferralCodeEntity>) {
    super();
    Object.assign(this, partial);
  }
}
