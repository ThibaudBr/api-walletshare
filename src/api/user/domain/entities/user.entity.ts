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
import { IsEmail, Length } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ProfileEntity } from '../../../entities-to-create/profile.entity';
import { UserRoleEnum } from '../enum/user-role.enum';
import { SubscriptionEntity } from '../../../entities-to-create/subscription.entity';
import { ReferralCodeEntity } from '../../../entities-to-create/referal-code.entity';
import { NotificationEntity } from '../../../entities-to-create/notification.entity';
import { AddressEntity } from '../../../entities-to-create/address.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  constructor(partial?: Partial<UserEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }

  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsEmail()
  @Column({ unique: true })
  email?: string;

  @Column()
  @Length(5, 20)
  @Column({ unique: true })
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
  userRoles: UserRoleEnum[];

  // _________________________________________________________
  // Relations
  // _________________________________________________________

  @OneToMany(() => ProfileEntity, profile => profile.user)
  profiles: ProfileEntity[];

  @OneToMany(() => SubscriptionEntity, subscription => subscription.user)
  subscriptions: SubscriptionEntity[];

  @OneToMany(() => ReferralCodeEntity, referralCode => referralCode.owner)
  referralCodes: ReferralCodeEntity[];

  @OneToMany(() => ReferralCodeEntity, referralCode => referralCode.usedBy)
  usedReferralCodes: ReferralCodeEntity;

  @OneToMany(() => NotificationEntity, notification => notification.user, {
    cascade: true,
  })
  notifications: NotificationEntity[];

  @OneToMany(() => AddressEntity, address => address.user, {
    cascade: true,
  })
  addresses: AddressEntity[];

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
