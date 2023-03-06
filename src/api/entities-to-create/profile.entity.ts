import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CardEntity } from './card.entity';

@Entity({ name: 'profile' })
export class ProfileEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToOne(() => UserEntity, user => user.profiles)
  user?: UserEntity;

  @OneToMany(() => CardEntity, card => card.owner, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  personalCards?: CardEntity[];

  @ManyToMany(() => CardEntity, card => card.profilesWhoSavedCard, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinTable({
    name: 'saved-card',
    joinColumn: {
      name: 'profile_id',
    },
    inverseJoinColumn: {
      name: 'card_id',
    },
  })
  savedCard?: CardEntity[];

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
