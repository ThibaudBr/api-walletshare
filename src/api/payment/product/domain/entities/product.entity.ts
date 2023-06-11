import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionEntity } from '../../../subscription/domain/entities/subscription.entity';
import { PriceEntity } from '../../../price/domain/entities/price.entity';
import { UserAccountStatusEnum } from '../../../../user/domain/enum/user-account-status.enum';
import {UserRoleEnum} from "../../../../user/domain/enum/user-role.enum";
import {RoleProfileEnum} from "../../../../profile/domain/enum/role-profile.enum";

@Entity({ name: 'plan' })
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ______________________________________________________
  // Properties
  // ______________________________________________________
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;
  @Column({ name: 'description', type: 'varchar', length: 255 })
  description: string;
  @Column({ name: 'stripe_price_id', type: 'varchar', length: 255 })
  stripeProductId: string;
  @Column({ name: 'default_stripe_price_id', type: 'varchar', length: 255 })
  defaultStripePriceId: string;
  @Column({ name: 'json_metadata', type: 'json', nullable: true })
  jsonStripeMetadata: object;
  @Column({ name: 'active', type: 'boolean', default: true })
  active: boolean;
  @Column({ type: 'enum', enum: UserAccountStatusEnum, default: UserAccountStatusEnum.FREE })
  public accountStatus: UserAccountStatusEnum;
  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.PUBLIC })
  public userRoleToGive: UserRoleEnum;
  @Column({ type: 'enum', enum: RoleProfileEnum, default: RoleProfileEnum.PREMIUM })
  public profileRoleToGive: RoleProfileEnum;
  // ______________________________________________________
  // Relations
  // ______________________________________________________
  @OneToMany(() => PriceEntity, priceEntity => priceEntity.product)
  prices: PriceEntity[];
  @CreateDateColumn()
  createdAt: Date;

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial?: Partial<ProductEntity>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
