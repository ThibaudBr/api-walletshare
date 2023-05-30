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
import { NotificationTypeEnum } from '../enum/notification-type.enum';
import { ProfileEntity } from '../../../profile/domain/entities/profile.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { GroupEntity } from '../../../groupe/domain/entities/group.entity';

@Entity({ name: 'notification' })
export class NotificationEntity extends BaseEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  title: string;

  @Column({ name: 'description', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  description: string;

  @Column({ type: 'enum', enum: NotificationTypeEnum, default: NotificationTypeEnum.INFO })
  type: NotificationTypeEnum;

  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  @Column({ name: 'link', type: 'varchar', length: 255, nullable: true })
  link: string;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToOne(() => UserEntity, userEntity => userEntity.notifications, { nullable: true, onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => ProfileEntity, profileEntity => profileEntity.notifications, { nullable: true, onDelete: 'CASCADE' })
  profile: ProfileEntity;

  @ManyToOne(() => GroupEntity, groupEntity => groupEntity.notifications, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  group: GroupEntity;

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  constructor(partial?: Partial<NotificationEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
