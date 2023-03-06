import { ProfileEntity } from './profile.entity';
import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OccupationEntity } from './occupation.entity';
import { CompanyEmployeeEntity } from './company-employee.entity';

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

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @OneToMany(() => CompanyEmployeeEntity, (companyEmployeeEntity) => companyEmployeeEntity.company)
  employees: CompanyEmployeeEntity[];

  @ManyToMany(() => OccupationEntity, (occupationEntity) => occupationEntity.companies)
  @JoinTable()
  occupations: OccupationEntity[];

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
