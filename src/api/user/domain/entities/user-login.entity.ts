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
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // ______________________________________________________
  @ManyToOne(() => UserEntity, user => user.userLogins)
  user: UserEntity;

  // ______________________________________________________
  // Relations
  // ______________________________________________________
  @Column()
  os: string;

  // ______________________________________________________
  // Properties
  @Column()
  device: string;
  @Column()
  ip: string;
  @CreateDateColumn()
  createdAt: Date;

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial: Partial<UserLoginEntity>) {
    super();
    Object.assign(this, partial);
  }
}
