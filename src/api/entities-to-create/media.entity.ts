import { ProfileEntity } from './profile.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GroupEntity } from './group.entity';
import { CardEntity } from './card.entity';
import CompanyEntity from './company.entity';

@Entity()
export class MediaEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  public key: string;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @OneToOne(() => GroupEntity, group => group.picture, { onDelete: 'CASCADE' })
  groupPicture: GroupEntity;

  @OneToOne(() => GroupEntity, group => group.bannerPicture, {
    onDelete: 'CASCADE',
  })
  groupBannerPicture: GroupEntity;

  @OneToOne(() => ProfileEntity, profileEntity => profileEntity.profilePicture, { onDelete: 'CASCADE' })
  profileEntityProfilePicture: ProfileEntity;
  @OneToOne(() => ProfileEntity, profileEntity => profileEntity.bannerPicture, { onDelete: 'CASCADE' })
  profileEntityBanner: ProfileEntity;

  @OneToOne(() => CardEntity, cardEntity => cardEntity.media, { onDelete: 'CASCADE' })
  CardPicture: CardEntity;

  @OneToOne(() => CompanyEntity, companyEntity => companyEntity.profilePicture, { onDelete: 'CASCADE' })
  companyProfilePicture: CompanyEntity;
  @OneToOne(() => CompanyEntity, companyEntity => companyEntity.bannerPicture, { onDelete: 'CASCADE' })
  companyEntityBanner: CompanyEntity;

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
