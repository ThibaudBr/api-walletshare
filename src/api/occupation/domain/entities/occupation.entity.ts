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
import CompanyEntity from '../../../entities-to-create/company.entity';
import { ProfileEntity } from '../../../profile/domain/entities/profile.entity';
import { Length } from 'class-validator';
import { CardEntity } from '../../../card/domain/entities/card.entity';

@Entity('occupation')
export class OccupationEntity extends BaseEntity {
  constructor(partial?: Partial<OccupationEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  @Length(2, 20)
  name: string;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToMany(() => ProfileEntity, profileEntity => profileEntity.occupations)
  profiles: ProfileEntity[];

  @ManyToMany(() => CompanyEntity, companyEntity => companyEntity.occupations)
  companies: CompanyEntity[];

  @ManyToMany(() => CardEntity, cardEntity => cardEntity.occupations)
  cards: CardEntity[];

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
