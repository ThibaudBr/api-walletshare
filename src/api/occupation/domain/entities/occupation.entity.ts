import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import CompanyEntity from '../../../company/domain/entities/company.entity';
import { ProfileEntity } from '../../../profile/domain/entities/profile.entity';
import { Length } from 'class-validator';
import { CardEntity } from '../../../card/domain/entities/card.entity';

@Entity('occupation')
export class OccupationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ______________________________________________________
  // Properties
  // ______________________________________________________
  @Column({ nullable: false })
  @Length(2, 20)
  name: string;
  @ManyToMany(() => ProfileEntity, profileEntity => profileEntity.occupations, {
    cascade: ['soft-remove', 'remove'],
    onDelete: 'CASCADE',
  })
  profiles: ProfileEntity[];

  // ______________________________________________________
  // Relations
  // ______________________________________________________
  @ManyToMany(() => CompanyEntity, companyEntity => companyEntity.occupations)
  companies: CompanyEntity[];
  @ManyToMany(() => CardEntity, cardEntity => cardEntity.occupations)
  cards: CardEntity[];
  @CreateDateColumn()
  createdAt: Date;

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial?: Partial<OccupationEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
