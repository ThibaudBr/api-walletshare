import { CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CardEntity } from '../../../card/domain/entities/card.entity';
import { GroupEntity } from './group.entity';

@Entity()
export class GroupRequestEntity {
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

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
