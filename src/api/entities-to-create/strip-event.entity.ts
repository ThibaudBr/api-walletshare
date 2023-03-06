import { PrimaryGeneratedColumn } from 'typeorm';

/**
 * @description
 * This is a flag to indicate if the user has registered with google.
 * @name StripEventEntity
 * @class StripEventEntity
 * @extends {BaseEntity}
 * @memberof PaymentEntity
 */
export default class StripEventEntity {
  @PrimaryGeneratedColumn()
  public id: string;
}
