import { BaseEntity, Column } from 'typeorm';

export class TimestampEntityExtendEntity extends BaseEntity {
  @Column({ type: 'timestamp', name: 'created_at' })
  public createdAt: Date;

  @Column({ type: 'timestamp', name: 'updated_at', onUpdate: 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;

  @Column({ type: 'timestamp', name: 'deleted_at' })
  public deletedAt: Date | null;

  public createTimestamp(): void {
    this.createdAt = new Date(Date.now());
    this.updatedAt = new Date(Date.now());
    this.deletedAt = null;
  }

  public updateTimestamp(): void {
    this.updatedAt = new Date(Date.now());
    this.deletedAt = null;
  }

  public deleteTimestamp(): void {
    this.deletedAt = new Date(Date.now());
  }
}
