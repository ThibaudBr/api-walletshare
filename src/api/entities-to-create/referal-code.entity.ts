import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionEntity } from '../payment/subscription/domain/entities/subscription.entity';
import { UserEntity } from '../user/domain/entities/user.entity';

@Entity('referral_code')
export class ReferralCodeEntity extends BaseEntity {
  @ApiProperty({ example: 'eb823d92-bf55-4210-8e24-89f4011bb96d' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'ABC123', minLength: 6, maxLength: 20 })
  @Column({ unique: true })
  @IsString()
  @Length(6, 10)
  code: string;

  @ApiProperty({ type: () => UserEntity })
  @OneToOne(() => UserEntity, user => user.usedReferralCodes)
  usedBy: UserEntity;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, user => user.referralCodes)
  owner: UserEntity;

  @ApiProperty({ type: () => SubscriptionEntity, required: false })
  @ManyToOne(() => SubscriptionEntity, { nullable: true })
  subscription: SubscriptionEntity;

  @ApiProperty({ type: () => Date })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: () => Date })
  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<ReferralCodeEntity>) {
    super();
    Object.assign(this, partial);
  }
}
