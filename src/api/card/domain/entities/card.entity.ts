import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WhoCanSeeCardInformationEnum } from '../enum/who-can-see-card-information.enum';
import { WhoCanCommunicateWithEnum } from '../enum/who-can-communicate-with.enum';
import { TypeOfCardEnum } from '../enum/type-of-card.enum';
import { SocialNetworkEntity } from '../../../social-network/domain/entities/social-network.entity';
import { IsEmail, IsUrl } from 'class-validator';
import { ConnectedCardEntity } from './connected-card.entity';
import { MediaEntity } from '../../../media/domain/entities/media.entity';
import { GroupMembershipEntity } from '../../../groupe/domain/entities/group-membership.entity';
import { ProfileEntity } from '../../../profile/domain/entities/profile.entity';
import { TransferableStatusCardEnum } from '../enum/transferable-status-card.enum';
import { MessageEntity } from '../../../conversation/domain/entities/message.entity';
import { WhoCanShareCardEnum } from '../enum/who-can-share-card.enum';
import { OccupationEntity } from '../../../occupation/domain/entities/occupation.entity';
import { CardViewEntity } from './card-view.entity';
import { CardPresetEntity } from '../../../company/domain/entities/card-preset.entity';

@Entity({ name: 'card' })
export class CardEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ______________________________________________________
  // Properties
  // ______________________________________________________
  @Column({ nullable: true })
  socialName?: string;
  @Column({ default: false })
  isOwnerPro: boolean;
  @Column({ nullable: true })
  firstname?: string;
  @Column({ nullable: true })
  lastname?: string;
  @Column({ nullable: true })
  companyName?: string;
  @Column('text', { array: true, default: [] })
  phones: string[];
  @Column('text', { array: true, default: [] })
  @IsEmail({}, { each: true })
  emails: string[];
  @Column('text', { array: true, default: [] })
  @IsUrl({}, { each: true })
  urls?: string[];
  @Column({ nullable: true })
  birthday?: Date;
  @Column('text', { nullable: true })
  notes?: string;
  @Column({ type: 'integer', default: 0 })
  numberOfShares: number;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToOne(() => ProfileEntity, profile => profile.personalCards, {
    cascade: ['insert', 'update'],
  })
  owner: ProfileEntity;

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
    cascade: ['insert', 'update'],
  })
  profilesWhoSavedCard: ProfileEntity[];
  @ManyToMany(() => OccupationEntity, occupation => occupation.cards, {
    onDelete: 'SET NULL',
    cascade: ['insert', 'update'],
  })
  @JoinTable()
  occupations: OccupationEntity[];
  @OneToMany(() => GroupMembershipEntity, groupMembership => groupMembership.card, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  groupMemberships: GroupMembershipEntity[];
  @OneToOne(() => MediaEntity, media => media.cardMedia, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  media: MediaEntity;
  @OneToMany(() => MessageEntity, message => message.author, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  messages?: MessageEntity[];
  @ManyToOne(() => SocialNetworkEntity, socialNetwork => socialNetwork.cards, {
    onDelete: 'SET NULL',
    cascade: ['insert', 'update'],
  })
  socialNetwork: SocialNetworkEntity;
  @OneToMany(() => CardViewEntity, cardView => cardView.card, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  cardViews: CardViewEntity[];
  @Column({ type: 'enum', enum: TypeOfCardEnum, default: TypeOfCardEnum.SOCIAL_NETWORK })
  typeOfCardEnum: TypeOfCardEnum;

  @ManyToOne(() => CardPresetEntity, cardPreset => cardPreset.cards, {
    onDelete: 'SET NULL',
    cascade: ['insert', 'update'],
    eager: true,
  })
  preset?: CardPresetEntity;

  // ______________________________________________________
  // Enum
  // ______________________________________________________
  @Column('text', { array: true, default: [WhoCanShareCardEnum.DIFFUSIBLE] })
  whoCanShareCardEnum: WhoCanShareCardEnum[];
  @Column('text', { array: true, default: [WhoCanSeeCardInformationEnum.ALL] })
  whoCanSeeCardInformationEnum: WhoCanSeeCardInformationEnum[];
  @Column('text', { array: true, default: [WhoCanCommunicateWithEnum.ALL] })
  whoCanCommunicateWithEnum: WhoCanCommunicateWithEnum[];
  @Column('text', { array: true, default: [TransferableStatusCardEnum.IS_TRANSFERABLE] })
  transferableStatusCardEnum: TransferableStatusCardEnum[];
  @CreateDateColumn()
  createdAt: Date;

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial: Partial<CardEntity>) {
    super();
    Object.assign(this, partial);
  }
}
