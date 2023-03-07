import { Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * @name StripEventEntity
 * @class StripEventEntity
 * @extends {BaseEntity}
 * @memberof PaymentEntity
 */
@Entity({ name: 'strip_event' })

export default class StripEventEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn()
  public id: string;
}
