export class ErrorCustomEvent {
  public readonly localisation: string;
  public readonly handler: string;
  public readonly error: string;

  constructor(partial: Partial<ErrorCustomEvent>) {
    Object.assign(this, partial);
  }
}
