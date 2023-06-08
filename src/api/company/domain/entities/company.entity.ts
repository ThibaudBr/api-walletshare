import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OccupationEntity } from '../../../occupation/domain/entities/occupation.entity';
import { CompanyEmployeeEntity } from './company-employee.entity';
import { ProfileEntity } from '../../../profile/domain/entities/profile.entity';
import { MediaEntity } from '../../../media/domain/entities/media.entity';
import { AddressEntity } from '../../../address/domain/entities/address.entity';
import { CardPresetEntity } from './card-preset.entity';

@Entity({ name: 'company' })
export class CompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ______________________________________________________
  // Properties
  // ______________________________________________________
  @Column({ nullable: true })
  name?: string;
  @Column({ nullable: true })
  siret?: string;
  @Column({ nullable: true })
  banner_url?: string;
  @Column({ nullable: true })
  description?: string;
  @Column({ nullable: true })
  website?: string;
  @Column({ nullable: true })
  phone?: string;
  @Column({ nullable: true })
  email?: string;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @OneToMany(() => CompanyEmployeeEntity, companyEmployeeEntity => companyEmployeeEntity.company)
  employees: CompanyEmployeeEntity[];

  @ManyToMany(() => OccupationEntity, occupationEntity => occupationEntity.companies)
  @JoinTable()
  occupations: OccupationEntity[];

  @ManyToOne(() => ProfileEntity, profileEntity => profileEntity.ownerCompanies, {
    cascade: ['update'],
  })
  ownerProfile: ProfileEntity;

  @OneToOne(() => MediaEntity, media => media.avatarProfileMedia, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  avatarMedia?: MediaEntity;
  @OneToOne(() => MediaEntity, media => media.bannerProfileMedia, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  bannerMedia?: MediaEntity;
  @OneToMany(() => AddressEntity, address => address.company, {
    cascade: true,
  })
  addresses: AddressEntity[];

  @OneToMany(() => CardPresetEntity, cardPresetEntity => cardPresetEntity.company, {
    cascade: true,
  })
  cardPresets: CardPresetEntity[];

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial?: Partial<CompanyEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
