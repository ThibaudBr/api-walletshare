import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SubscriptionEntity } from '../../../subscription/domain/entities/subscription.entity';
import { InvoiceStatusEnum } from '../../../price/domain/invoice-status.enum';

@Entity('invoices')
export class InvoicesEntity extends BaseEntity {
  // ______________________________________________________
  // Properties
  // ______________________________________________________

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'amount', type: 'int' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @Column({ name: 'currency', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @Column({ type: 'enum', enum: InvoiceStatusEnum, nullable: true, default: InvoiceStatusEnum.PAID })
  status?: InvoiceStatusEnum;

  @Column({ name: 'invoice_number', type: 'varchar', length: 255, nullable: true })
  invoiceNumber?: string;

  @Column({ name: 'client_name', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @Column({ name: 'client_address', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  clientAddress: string;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  @IsNotEmpty()
  @IsString()
  description?: string;

  @Column({ name: 'tax_rate', type: 'decimal', nullable: true })
  taxRate?: number;

  @Column({ name: 'total_amount', type: 'decimal' })
  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @Column({ name: 'stripe_customer_id', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  stripeCustomerId: string;

  @Column({ name: 'stripe_invoice_id', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  stripeInvoiceId: string;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToOne(() => SubscriptionEntity, subscriptionEntity => subscriptionEntity.invoices)
  subscription: SubscriptionEntity;

  // ______________________________________________________
  // Timestamps
  // ______________________________________________________

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial?: Partial<InvoicesEntity>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
