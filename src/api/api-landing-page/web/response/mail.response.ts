export class MailResponse {
  public readonly mail: string;

  constructor(partial: Partial<MailResponse>) {
    Object.assign(this, partial);
  }
}
