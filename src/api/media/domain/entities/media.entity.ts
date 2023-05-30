import { ProfileEntity } from '../../../profile/domain/entities/profile.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GroupEntity } from '../../../groupe/domain/entities/group.entity';
import { CompanyEntity } from '../../../company/domain/entities/company.entity';
import { CardEntity } from '../../../card/domain/entities/card.entity';
import { MessageEntity } from '../../../conversation/domain/entities/message.entity';

@Entity({ name: 'media' })
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

  @OneToOne(() => GroupEntity, group => group.avatarMedia, { onDelete: 'CASCADE' })
  avatarGroupMedia: GroupEntity;

  @OneToOne(() => GroupEntity, group => group.bannerMedia, {
    onDelete: 'CASCADE',
  })
  bannerGroupMedia: GroupEntity;

  @OneToOne(() => ProfileEntity, profileEntity => profileEntity.avatarMedia, { onDelete: 'CASCADE' })
  avatarProfileMedia: ProfileEntity;
  @OneToOne(() => ProfileEntity, profileEntity => profileEntity.bannerMedia, { onDelete: 'CASCADE' })
  bannerProfileMedia: ProfileEntity;

  @OneToOne(() => CardEntity, cardEntity => cardEntity.media, { onDelete: 'CASCADE' })
  cardMedia: CardEntity;

  @OneToOne(() => CompanyEntity, companyEntity => companyEntity.avatarMedia, { onDelete: 'CASCADE' })
  avatarCompanyMedia: CompanyEntity;
  @OneToOne(() => CompanyEntity, companyEntity => companyEntity.bannerMedia, { onDelete: 'CASCADE' })
  bannerCompanyMedia: CompanyEntity;

  @OneToOne(() => MessageEntity, messageEntity => messageEntity.media, { onDelete: 'CASCADE' })
  messageMedia: MessageEntity;

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
