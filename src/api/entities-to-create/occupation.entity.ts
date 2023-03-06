import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import CompanyEntity from './company.entity';
import { CardEntity } from './card.entity';
import { ProfileEntity } from './profile.entity';

@Entity('occupation')
export class OccupationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  name: string;

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
