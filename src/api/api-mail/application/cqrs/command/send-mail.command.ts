export class SendMailCommand {
  constructor(partial: Partial<SendMailCommand>) {
    Object.assign(this, partial);
  }

  public readonly email: string;

  public readonly title?: string | undefined;

  public readonly message?: string | undefined;
}
