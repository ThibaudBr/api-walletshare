export class SendMailCommand {
  public readonly email: string;
  public readonly title?: string;
  public readonly message?: string;

  constructor(partial: Partial<SendMailCommand>) {
    Object.assign(this, partial);
  }
}
