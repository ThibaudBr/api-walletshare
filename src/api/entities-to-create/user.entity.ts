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

  @Column()
  @Length(5, 20)
  @Column({ unique: true })
  username?: string;

  @Column({ unique: false, nullable: false, select: false })
  password: string;

  @Exclude()
  public jwtToken?: string;

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
