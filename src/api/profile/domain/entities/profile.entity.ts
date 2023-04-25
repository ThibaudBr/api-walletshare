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
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { OccupationEntity } from '../../../occupation/domain/entities/occupation.entity';
import { CompanyEmployeeEntity } from '../../../entities-to-create/company-employee.entity';
import { MediaEntity } from '../../../entities-to-create/media.entity';
import { JoinedConversation } from '../../../entities-to-create/joined-conversation.entity';
import CompanyEntity from '../../../entities-to-create/company.entity';
import { NotificationEntity } from '../../../entities-to-create/notification.entity';
import { RoleProfileEnum } from '../enum/role-profile.enum';
import { CardEntity } from '../../../card/domain/entities/card.entity';
import { IsEnum, Length } from 'class-validator';

@Entity({ name: 'profile' })
export class ProfileEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  @Length(3, 30)
  usernameProfile: string;

  // ______________________________________________________
  // Enum
  // ______________________________________________________
  @Column({ type: 'enum', enum: RoleProfileEnum, default: RoleProfileEnum.CLASSIC })
  @IsEnum(RoleProfileEnum)
  roleProfile: RoleProfileEnum;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToOne(() => UserEntity, user => user.profiles)
  user: UserEntity;

  @OneToMany(() => CardEntity, card => card.owner, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  personalCards?: CardEntity[];

  @ManyToMany(() => CardEntity, card => card.profilesWhoSavedCard, {
    cascade: ['soft-remove', 'remove', 'recover'],
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
    cascade: ['update', 'insert'],
    onUpdate: 'CASCADE',
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

  constructor(partial: Partial<ProfileEntity>) {
    Object.assign(this, partial);
  }
}
