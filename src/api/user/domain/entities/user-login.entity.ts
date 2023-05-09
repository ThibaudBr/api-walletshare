import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user-login' })
export class UserLoginEntity extends BaseEntity {
  constructor(partial: Partial<UserLoginEntity>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ______________________________________________________
  // Relations
  // ______________________________________________________
  @ManyToOne(() => UserEntity, user => user.userLogins)
  user: UserEntity;

  // ______________________________________________________
  // Properties
  // ______________________________________________________
  @Column()
  os: string;

  @Column()
  device: string;

  @Column()
  ip: string;

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
