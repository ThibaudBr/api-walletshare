export class UpdateCardPresetEvent {
  public readonly id: string;
  public readonly method: string = 'update-card-preset';
  public readonly module: string = 'company';

  constructor(partial: Partial<UpdateCardPresetEvent>) {
    Object.assign(this, partial);
  }
}
