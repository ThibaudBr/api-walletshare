import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ProfileEntity } from '../../../profile/domain/entities/profile.entity';
import { UserRoleEnum } from '../enum/user-role.enum';
import { SubscriptionEntity } from '../../../payment/subscription/domain/entities/subscription.entity';
import { ReferralCodeEntity } from './referral-code.entity';
import { NotificationEntity } from '../../../notification/domain/entities/notification.entity';
import { AddressEntity } from '../../../address/domain/entities/address.entity';
import { UserLoginEntity } from './user-login.entity';
import { UserAccountStatusEnum } from '../enum/user-account-status.enum';
import { ConnectedUserEntity } from '../../../conversation/domain/entities/connected-user.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ______________________________________________________
  // Properties
  // ______________________________________________________
  @Column({ unique: false, nullable: true })
  mail?: string;

  @Column({ unique: false, nullable: true })
  username?: string;
  /**
   * @description
   * Password is nullable because user can connect with Google
   */
  @Column({ unique: false, nullable: true, select: false })
  @Exclude()
  password: string;
  /**
   * @description
   * This is a flag to indicate if the user has confirmed their email address.
   * This is used to prevent users from logging in before they have confirmed their email address.
   */
  @Column({ default: false })
  isEmailConfirmed: boolean;
  @Column({
    nullable: true,
    select: false,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;
  @Exclude()
  public jwtToken?: string;

  /**
   * @description
   * This is a flag to indicate if the user has registered with google.
   */
  @Column({ default: false })
  public isRegisteredWithGoogle: boolean;
  @Column('text', { array: true, default: [UserRoleEnum.PUBLIC] })
  roles: UserRoleEnum[];
  @Column({ type: 'enum', enum: UserAccountStatusEnum, default: UserAccountStatusEnum.FREE })
  public accountStatus: UserAccountStatusEnum;

  // _________________________________________________________
  // Stripe
  // _________________________________________________________

  @Column({ nullable: true })
  public stripeCustomerId?: string;

  @Column({ nullable: true })
  public fcmToken?: string;
  // _________________________________________________________
  // Relations
  // _________________________________________________________
  @OneToMany(() => ProfileEntity, profile => profile.user, {
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
  })
  profiles: ProfileEntity[];

  @OneToMany(() => SubscriptionEntity, subscription => subscription.user, {
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
  })
  subscriptions: SubscriptionEntity[];

  @OneToOne(() => ReferralCodeEntity, referralCode => referralCode.owner, {})
  @JoinColumn()
  referralCode: ReferralCodeEntity;

  @ManyToOne(() => ReferralCodeEntity, referralCode => referralCode.usedBy)
  usedReferralCodes: ReferralCodeEntity;

  @OneToMany(() => NotificationEntity, notification => notification.user, {
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
  })
  notifications: NotificationEntity[];
  @OneToMany(() => AddressEntity, address => address.user, {
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
  })
  addresses: AddressEntity[];

  @OneToMany(() => UserLoginEntity, userLogin => userLogin.user, {
    cascade: ['insert', 'update'],
  })
  userLogins: UserLoginEntity[];

  @OneToOne(() => ConnectedUserEntity, connectedUser => connectedUser.user, {
    eager: true,
  })
  @JoinColumn()
  connection: ConnectedUserEntity;

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial?: Partial<UserEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
