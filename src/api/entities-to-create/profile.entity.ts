import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/domain/entities/user.entity';
import { CardEntity } from './card.entity';
import { OccupationEntity } from './occupation.entity';
import { CompanyEmployeeEntity } from './company-employee.entity';
import { MediaEntity } from './media.entity';
import { JoinedConversation } from './joined-conversation.entity';
import CompanyEntity from './company.entity';
import { NotificationEntity } from './notification.entity';

@Entity({ name: 'profile' })
export class ProfileEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  usernameProfile: string;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToOne(() => UserEntity, user => user.profiles)
  user?: UserEntity;

  @OneToMany(() => CardEntity, card => card.owner, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  personalCards?: CardEntity[];

  @ManyToMany(() => CardEntity, card => card.profilesWhoSavedCard, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinTable({
    name: 'saved-card',
    joinColumn: {
      name: 'profile_id',
    },
    inverseJoinColumn: {
      name: 'card_id',
    },
  })
  savedCard?: CardEntity[];

  @ManyToMany(() => OccupationEntity, occupation => occupation.profiles, {
    onDelete: 'SET NULL',
  })
  @JoinTable({
    name: 'profile-occupation',
    joinColumn: {
      name: 'profile_id',
    },
    inverseJoinColumn: {
      name: 'occupation_id',
    },
  })
  occupations?: OccupationEntity[];

  @OneToMany(() => CompanyEmployeeEntity, companyEmployee => companyEmployee.profile, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  companies?: CompanyEmployeeEntity[];

  @OneToOne(() => MediaEntity, media => media.profileEntityProfilePicture, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  profilePicture?: MediaEntity;

  @OneToOne(() => MediaEntity, media => media.profileEntityBanner, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  bannerPicture?: MediaEntity;

  @OneToMany(() => JoinedConversation, joinedConversation => joinedConversation.profile, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  joinedConversations?: JoinedConversation[];

  @OneToMany(() => CompanyEntity, companyEntity => companyEntity.ownerProfile, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  ownerCompanies?: CompanyEntity[];

  @OneToMany(() => NotificationEntity, notification => notification.profile, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  notifications: NotificationEntity[];

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
