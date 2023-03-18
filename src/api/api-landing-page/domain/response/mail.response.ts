export class MailResponse {
  constructor(partial: Partial<MailResponse>) {
    Object.assign(partial);
  }

  public readonly mail: string;
}
