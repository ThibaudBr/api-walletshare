export class IdProfileDto {
  public readonly id: string;

  constructor(partial: Partial<IdProfileDto>) {
    Object.assign(this, partial);
  }
}
