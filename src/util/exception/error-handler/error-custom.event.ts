export class ErrorCustomEvent {
  constructor(partial: Partial<ErrorCustomEvent>) {
    Object.assign(this, partial);
  }

  public readonly localisation: string;
  public readonly handler: string;
  public readonly error: string;
}
