export class UpdateFcmTokenRequest {
  public readonly fcmToken: string;

  constructor(partial: Partial<UpdateFcmTokenRequest>) {
    Object.assign(this, partial);
  }
}
