import { CompanyEntity } from './company.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CardEntity } from '../../../card/domain/entities/card.entity';
import { MediaEntity } from '../../../media/domain/entities/media.entity';
import { AlignmentCardEnum } from '../enum/alignment-card.enum';

@Entity()
export class CardPresetEntity extends BaseEntity {
  constructor(partial?: Partial<CardPresetEntity>) {
    super();
    if (partial) {
      Object.assign(this, partial);
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'alignment', type: 'enum', enum: AlignmentCardEnum, default: AlignmentCardEnum.LEFT })
  alignment: AlignmentCardEnum;

  @Column({ name: 'background_color', type: 'varchar', length: 7, default: '#ffffff' })
  backgroundColor: string;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToOne(() => CompanyEntity, company => company.cardPresets)
  company: CompanyEntity;

  @OneToMany(() => CardEntity, card => card.preset, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  cards?: CardEntity[];

  @OneToOne(() => MediaEntity, mediaEntity => mediaEntity.cardPresetMedia, { cascade: true, onDelete: 'SET NULL' })
  @JoinColumn()
  media?: MediaEntity;
}
