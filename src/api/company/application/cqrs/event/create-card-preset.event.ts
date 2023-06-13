export class CreateCardPresetEvent {
  public readonly id: string;
  public readonly companyId: string;
  public readonly module: string = 'company';
  public readonly method: string = 'create-card-preset';

  constructor(partial: Partial<CreateCardPresetEvent>) {
    Object.assign(this, partial);
  }
}
