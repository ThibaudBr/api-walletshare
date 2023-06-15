export class SendMailCommand {
  public readonly path: string;
  public readonly email: string;
  public readonly title?: string;
  public readonly message?: string;
  public readonly password?: string;
  public readonly language: string;

  constructor(partial: Partial<SendMailCommand>) {
    Object.assign(this, partial);
  }
}
