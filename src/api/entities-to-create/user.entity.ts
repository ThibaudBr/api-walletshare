import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ProfileEntity } from './profile.entity';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from './enum/user-role.enum';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  constructor(partial?: Partial<UserEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsEmail()
  @Column({ unique: true })
  email?: string;

  /**
   * @description
   * This is a flag to indicate if the user has confirmed their email address.
   * This is used to prevent users from logging in before they have confirmed their email address.
   */
  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column()
  @Length(5, 20)
  @Column({ unique: true })
  username?: string;

  /**
   * @description
   * Password is nullable because user can connect with Google
   */
  @Column({ unique: false, nullable: true, select: false })
  password: string;

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
  /**
   * @description
   * This is a flag to indicate if the user has a stripe customer id.
   */
  @Column({ unique: true, nullable: true })
  public stripCustomerId?: string;
  @Column({ nullable: true })
  public monthlySubscriptionStatus?: string;

  // _________________________________________________________
  // Relations
  // _________________________________________________________

  @OneToMany(() => ProfileEntity, profile => profile.user)
  @JoinTable({
    name: 'user_profile',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'profile_id',
    },
  })
  profiles: ProfileEntity[];

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  async setPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password || this.password, 10);
  }
}
