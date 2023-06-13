import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../../user/domain/entities/user.entity';

@Entity('connected_user')
export class ConnectedUserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  socketId: string;

  @OneToOne(() => UserEntity, user => user.connection)
  @JoinColumn()
  user: UserEntity;
}
