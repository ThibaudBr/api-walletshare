import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { ConnectedCardEntity } from './connected-card.entity';
import { WhoCanShareCardEnum } from './enum/who-can-share-card.enum';
import { WhoCanSeeCardInformationEnum } from './enum/who-can-see-card-information.enum';
import { TypeOfCardEnum } from './enum/type-of-card.enum';
import { IsEmail, IsUrl } from 'class-validator';
import { OccupationEntity } from './occupation.entity';
import { WhoCanCommunicateWithEnum } from './enum/who-can-communicate-with.enum';

@Entity({ name: 'card' })
export class CardEntity extends BaseEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  socialName: string;

  @Column({ nullable: true })
  socialNetwork: string;
  @Column({ default: false })
  isOwnerPro: boolean;
  @Column({ nullable: true })
  firstname: string;
  @Column({ nullable: true })
  lastname: string;
  @Column({ nullable: true })
  companyName: string;
  @Column('text', { array: true, default: [] })
  phones: string[];
  @Column('text', { array: true, default: [] })
  @IsEmail({}, { each: true })
  emails: string[];
  @Column({ nullable: true })
  @IsUrl({}, { each: true })
  urls: string[];
  @Column({ nullable: true })
  birthday: Date;
  @Column('text', { nullable: true })
  notes: string;
  @Column({ nullable: true })
  occupation: string;

  @Column({ type: 'integer', default: 0 })
  numberOfShares: number;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToOne(() => ProfileEntity, profile => profile.personalCards)
  owner: ProfileEntity[];

  @OneToMany(() => ConnectedCardEntity, connectedCard => connectedCard.cardEntityOne, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  connectedCardOne: ConnectedCardEntity[];

  @OneToMany(() => ConnectedCardEntity, connectedCard => connectedCard.cardEntityTwo, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  connectedCardTwo: ConnectedCardEntity[];

  @ManyToMany(() => ProfileEntity, profile => profile.savedCard, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  profilesWhoSavedCard: ProfileEntity[];

  @ManyToMany(() => OccupationEntity, occupation => occupation.cards, {
    onDelete: 'SET NULL',
  })
  @JoinTable()
  occupations: OccupationEntity[];

  // ______________________________________________________
  // Enum
  // ______________________________________________________

  @Column('text')
  typeOfCardEnum: TypeOfCardEnum;

  @Column({ type: 'set', enum: WhoCanShareCardEnum, default: [WhoCanShareCardEnum.DIFFUSIBLE] })
  whoCanShareCardEnums: WhoCanShareCardEnum[];

  @Column({ type: 'set', enum: WhoCanSeeCardInformationEnum, default: [WhoCanSeeCardInformationEnum.ALL] })
  whoCanSeeCardInformationEnums: WhoCanSeeCardInformationEnum[];

  @Column({ type: 'set', enum: WhoCanCommunicateWithEnum, default: [WhoCanCommunicateWithEnum.ALL] })
  whoCanSendMessagesEnums: WhoCanCommunicateWithEnum[];

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
