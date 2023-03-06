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
import { ProfileEntity } from './profile.entity';
import { RoleCompanyEmployeeEnum } from './enum/role-company-employee.enum';

@Entity('company-employee')
export class CompanyEmployeeEntity {
  constructor(partial?: Partial<CompanyEmployeeEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { array: true, default: [RoleCompanyEmployeeEnum.EMPLOYEE] })
  roles: RoleCompanyEmployeeEnum[];

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToOne(() => CompanyEntity, company => company.employees)
  company: CompanyEntity;

  @ManyToOne(() => ProfileEntity, profile => profile.companies)
  profile: ProfileEntity;

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
