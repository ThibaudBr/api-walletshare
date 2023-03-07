import { PrimaryGeneratedColumn } from 'typeorm';

/**
 * @name StripEventEntity
 * @class StripEventEntity
 * @extends {BaseEntity}
 * @memberof PaymentEntity
 */
export default class StripEventEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn()
  public id: string;
}
