export class SendMailEvent {
  constructor(partial: Partial<SendMailEvent>) {
    Object.assign(this, partial);
  }

  public readonly module: string = 'api-mail';
  public readonly method: string = 'send-mail';

  public readonly email: string;

  public readonly title?: string;

  public readonly message?: string;
}
