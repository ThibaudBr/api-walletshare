import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardEntity } from '../../../card/domain/entities/card.entity';
import { IsNotEmpty, IsUrl, Length, Matches } from 'class-validator';

/**
 * @description
 * define the social network entity
 * @class
 * @classdesc define the social network entity
 * @memberof module:entities
 * @name SocialNetworkEntity
 * @property {string} id - the id of the social network
 * @property {string} name - the name of the social network
 * @property {string} url - the url of the social network
 * @property {string} icon - the icon of the social network
 * @property {Date} createdAt - the date of creation of the social network
 * @property {Date} updatedAt - the date of update of the social network
 * @property {Date} deletedAt - the date of deletion of the social network
 */
@Entity({ name: 'social_network' })
export class SocialNetworkEntity extends BaseEntity {
  constructor(partial: Partial<SocialNetworkEntity>) {
    super();
    Object.assign(this, partial);
  }
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Length(2, 50)
  name: string;

  @Column()
  @IsUrl()
  url: string;

  @Column()
  @IsNotEmpty()
  icon: string;

  @Column()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'The field must be a valid hexadecimal RGB value',
  })
  color: string;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @OneToMany(() => CardEntity, cardEntity => cardEntity.socialNetwork)
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
