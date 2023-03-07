import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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
@Entity()
export class SocialNetworkEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  icon: string;

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
