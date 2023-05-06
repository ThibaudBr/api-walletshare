import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import CompanyEntity from '../../../company/domain/entities/company.entity';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'address' })
export class AddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'street', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  street: string;

  @Column({ name: 'city', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  city: string;

  @Column({ name: 'state', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  state: string;

  @Column({ name: 'country', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  country: string;

  @Column({ name: 'zip_code', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @Column({ name: 'latitude', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  latitude: string;

  @Column({ name: 'longitude', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  longitude: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => UserEntity, userEntity => userEntity.addresses, { nullable: true, onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => CompanyEntity, companyEntity => companyEntity.addresses, { nullable: true, onDelete: 'CASCADE' })
  company: CompanyEntity;

  constructor(partial?: Partial<AddressEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
