import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import CompanyEntity from './company.entity';
import { ProfileEntity } from '../profile/domain/entities/profile.entity';
import { RoleCompanyEmployeeEnum } from './enum/role-company-employee.enum';

@Entity('company_employee')
export class CompanyEmployeeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ______________________________________________________
  // Properties
  // ______________________________________________________
  @Column('text', { array: true, default: [RoleCompanyEmployeeEnum.EMPLOYEE] })
  roles: RoleCompanyEmployeeEnum[];
  @ManyToOne(() => CompanyEntity, company => company.employees)
  company: CompanyEntity;

  // ______________________________________________________
  // Relations
  // ______________________________________________________
  @ManyToOne(() => ProfileEntity, profile => profile.companies)
  profile: ProfileEntity;
  @CreateDateColumn()
  createdAt: Date;

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial?: Partial<CompanyEmployeeEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
