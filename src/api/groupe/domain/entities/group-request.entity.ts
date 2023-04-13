import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CardEntity } from '../../../card/domain/entities/card.entity';
import { GroupEntity } from './group.entity';
import { GroupRequestStatusEnum } from '../enum/group-request-status.enum';

@Entity({ name: 'group_request' })
export class GroupRequestEntity extends BaseEntity {
  constructor(partial: Partial<GroupRequestEntity>) {
    super();
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => GroupEntity, groupEntity => groupEntity.groupRequests, {
    onDelete: 'CASCADE',
  })
  group: GroupEntity;

  @ManyToOne(() => CardEntity, cardEntity => cardEntity.groupRequests, {
    onDelete: 'CASCADE',
  })
  card: CardEntity;

  @Column()
  status: GroupRequestStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
