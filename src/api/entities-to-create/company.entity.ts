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
import { OccupationEntity } from '../occupation/domain/entities/occupation.entity';
import { CompanyEmployeeEntity } from './company-employee.entity';
import { ProfileEntity } from '../profile/domain/entities/profile.entity';
import { MediaEntity } from './media.entity';
import { AddressEntity } from './address.entity';

@Entity({ name: 'company' })
export default class CompanyEntity {
  constructor(partial?: Partial<CompanyEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  address?: string;

  @Column({ nullable: true })
  zip_code?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  country?: string;

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

  @ManyToOne(() => ProfileEntity, profileEntity => profileEntity.ownerCompanies)
  ownerProfile: ProfileEntity;

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

  @OneToMany(() => AddressEntity, address => address.company, {
    cascade: true,
  })
  addresses: AddressEntity[];

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
