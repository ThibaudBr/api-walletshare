export class CreateSaveLoginCommand {
  public readonly userId: string;
  public readonly os?: string;
  public readonly device?: string;
  public readonly ip?: string;
  public readonly platform?: string;

  constructor(partial: Partial<CreateSaveLoginCommand>) {
    Object.assign(this, partial);
  }
}
