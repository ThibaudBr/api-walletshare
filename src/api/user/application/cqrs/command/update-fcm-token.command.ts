export class UpdateFcmTokenCommand {
  public readonly userId: string;
  public readonly fcmToken: string;

  constructor(partial: Partial<UpdateFcmTokenCommand>) {
    Object.assign(this, partial);
  }
}
