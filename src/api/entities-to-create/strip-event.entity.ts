import { PrimaryGeneratedColumn } from 'typeorm';

export default class StripEventEntity {
  @PrimaryGeneratedColumn()
  public id: string;
}
