import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { SubscriptionEntity } from './subscription.entity';
import { StatusInvoiceEnum } from './enum/status-invoice.enum';

@Entity('invoices')
export class InvoicesEntity {
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

  // @Column({ type: 'enum', enum: StatusInvoiceEnum, default: StatusInvoiceEnum.PENDING })
  // @IsEnum(StatusInvoiceEnum)
  // status: StatusInvoiceEnum;

  // Informations supplémentaires pour la France

  @Column({ name: 'invoice_number', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  invoiceNumber: string;

  @Column({ name: 'company_name', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @Column({ name: 'company_address', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  companyAddress: string;

  @Column({ name: 'company_vat_number', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  companyVatNumber: string;

  @Column({ name: 'client_name', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @Column({ name: 'client_address', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  clientAddress: string;

  @Column({ name: 'client_vat_number', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  clientVatNumber: string;

  @Column({ name: 'description', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  description: string;

  @Column({ name: 'tax_rate', type: 'decimal' })
  @IsNotEmpty()
  @IsNumber()
  taxRate: number;

  @Column({ name: 'total_tax', type: 'decimal' })
  @IsNotEmpty()
  @IsNumber()
  totalTax: number;

  @Column({ name: 'total_amount', type: 'decimal' })
  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @Column({ name: 'discount_amount', type: 'decimal', nullable: true })
  @IsNumber()
  discountAmount?: number;

  // ______________________________________________________
  // Relations
  // ______________________________________________________

  @ManyToOne(() => SubscriptionEntity, subscriptionEntity => subscriptionEntity.invoices)
  @ValidateNested()
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
}
