import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationTypeEnum } from './enum/notification-type.enum';
import { ProfileEntity } from './profile.entity';
import { ConversationEntity } from './conversation.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserEntity } from '../user/domain/entities/user.entity';

@Entity({ name: 'notification' })
export class NotificationEntity {
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

  @ManyToOne(() => UserEntity, userEntity => userEntity.notifications, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => ProfileEntity, profileEntity => profileEntity.notifications, { onDelete: 'CASCADE' })
  profile: ProfileEntity;

  @ManyToOne(() => ConversationEntity, conversationEntity => conversationEntity.notifications, { onDelete: 'CASCADE' })
  conversation: ConversationEntity;

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;
}
