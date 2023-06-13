import { CompanyEntity } from './company.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardEntity } from '../../../card/domain/entities/card.entity';
import { MediaEntity } from '../../../media/domain/entities/media.entity';
import { AlignmentCardEnum } from '../enum/alignment-card.enum';

@Entity()
export class CardPresetEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'alignment', type: 'enum', enum: AlignmentCardEnum, default: AlignmentCardEnum.LEFT })
  alignment: AlignmentCardEnum;
  @Column({ name: 'background_color', type: 'varchar', length: 7, default: '#ffffff' })
  backgroundColor: string;
  @ManyToOne(() => CompanyEntity, company => company.cardPresets)
  company: CompanyEntity;

  // ______________________________________________________
  // Relations
  // ______________________________________________________
  @OneToMany(() => CardEntity, card => card.preset, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  cards?: CardEntity[];
  @OneToOne(() => MediaEntity, mediaEntity => mediaEntity.cardPresetMedia, { cascade: true, onDelete: 'SET NULL' })
  @JoinColumn()
  media?: MediaEntity;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial?: Partial<CardPresetEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
