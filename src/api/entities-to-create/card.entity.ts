import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProfileEntity } from '../profile/domain/entities/profile.entity';
import { ConnectedCardEntity } from './connected-card.entity';
import { WhoCanShareCardEnum } from './enum/who-can-share-card.enum';
import { WhoCanSeeCardInformationEnum } from './enum/who-can-see-card-information.enum';
import { TypeOfCardEnum } from './enum/type-of-card.enum';
import { IsEmail, IsUrl, MaxLength } from 'class-validator';
import { OccupationEntity } from './occupation.entity';
import { WhoCanCommunicateWithEnum } from './enum/who-can-communicate-with.enum';
import { MediaEntity } from './media.entity';
import { GroupMembershipEntity } from './group-membership.entity';
import { MessageEntity } from './message.entity';
import { TransferableStatusCardEnum } from './enum/transferable-status-card.enum';
import { SocialNetworkEntity } from './social-network.entity';

@Entity({ name: 'card' })
export class CardEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  @MaxLength(255)
  socialName?: string;

  @Column({ default: false })
  isOwnerPro: boolean;

  @Column({ nullable: true })
  @MaxLength(255)
  firstname?: string;

  @Column({ nullable: true })
  @MaxLength(255)
  lastname?: string;

  @Column({ nullable: true })
  @MaxLength(255)
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

  @Column({ nullable: true })
  @MaxLength(255)
  occupation?: string;

  @Column({ type: 'integer', default: 0 })
  numberOfShares: number;

  @Column('text', { array: true, default: [TransferableStatusCardEnum.IS_TRANSFERABLE] })
  transferableStatusCardEnum: TransferableStatusCardEnum[];

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

  @ManyToMany(() => ProfileEntity, profile => profile.savedCard)
  profilesWhoSavedCard: ProfileEntity[];

  @ManyToMany(() => OccupationEntity, occupation => occupation.cards, {
    onDelete: 'SET NULL',
  })
  @JoinTable()
  occupations: OccupationEntity[];

  @OneToMany(() => GroupMembershipEntity, groupMembership => groupMembership.card, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  groupMemberships: GroupMembershipEntity[];

  @OneToOne(() => MediaEntity, media => media.CardPicture, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  media: MediaEntity;

  @OneToMany(() => MessageEntity, message => message.author, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  messages?: MessageEntity[];

  @ManyToOne(() => SocialNetworkEntity, socialNetwork => socialNetwork.cards, {
    onDelete: 'SET NULL',
  })
  socialNetwork: SocialNetworkEntity;

  // ______________________________________________________
  // Enum
  // ______________________________________________________

  @Column({ type: 'enum', enum: TypeOfCardEnum, default: TypeOfCardEnum.SOCIAL_NETWORK })
  typeOfCardEnum: TypeOfCardEnum;

  @Column('text', { array: true, default: [WhoCanShareCardEnum.DIFFUSIBLE] })
  whoCanShareCardEnums: WhoCanShareCardEnum[];

  @Column('text', { array: true, default: [WhoCanSeeCardInformationEnum.ALL] })
  whoCanSeeCardInformationEnums: WhoCanSeeCardInformationEnum[];

  @Column('text', { array: true, default: [WhoCanCommunicateWithEnum.ALL] })
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
