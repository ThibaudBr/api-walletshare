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
import { Exclude } from 'class-transformer';
import { ProfileEntity } from '../../../profile/domain/entities/profile.entity';
import { UserRoleEnum } from '../enum/user-role.enum';
import { SubscriptionEntity } from '../../../entities-to-create/subscription.entity';
import { ReferralCodeEntity } from '../../../entities-to-create/referal-code.entity';
import { NotificationEntity } from '../../../notification/domain/entities/notification.entity';
import { AddressEntity } from '../../../address/domain/entities/address.entity';
import { UserLoginEntity } from './user-login.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ______________________________________________________
  // Properties
  // ______________________________________________________
  @Column({ unique: true, nullable: true })
  mail?: string;

  @Column({ unique: true, nullable: true })
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
  @Column({ unique: true, nullable: true })
  public referralCode?: string;
  /**
   * @description
   * This is a flag to indicate if the user has registered with google.
   */
  @Column({ default: false })
  public isRegisteredWithGoogle: boolean;
  @Column('text', { array: true, default: [UserRoleEnum.PUBLIC] })
  roles: UserRoleEnum[];
  @OneToMany(() => ProfileEntity, profile => profile.user, {
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
  })
  profiles: ProfileEntity[];

  // _________________________________________________________
  // Relations
  // _________________________________________________________
  @OneToMany(() => SubscriptionEntity, subscription => subscription.user, {
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
  })
  subscriptions: SubscriptionEntity[];
  @OneToMany(() => ReferralCodeEntity, referralCode => referralCode.owner, {
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
    onDelete: 'CASCADE',
  })
  referralCodes: ReferralCodeEntity[];
  @OneToMany(() => ReferralCodeEntity, referralCode => referralCode.usedBy)
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
