import { Entity, PrimaryColumn } from 'typeorm';

/**
 * @name StripeEventEntity
 * @class StripeEventEntity
 * @extends {BaseEntity}
 * @memberof PaymentEntity
 */
@Entity({ name: 'strip_event' })
export default class StripeEventEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryColumn()
  public id: string;
}
