export class MailResponse {
  constructor(partial: Partial<MailResponse>) {
    Object.assign(this, partial);
  }

  public readonly mail: string;
}
