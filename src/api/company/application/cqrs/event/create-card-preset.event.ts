export class CreateCardPresetEvent {
  constructor(partial: Partial<CreateCardPresetEvent>) {
    Object.assign(this, partial);
  }

  public readonly id: string;
  public readonly companyId: string;
  public readonly module: string = 'company';
  public readonly method: string = 'create-card-preset';
}
