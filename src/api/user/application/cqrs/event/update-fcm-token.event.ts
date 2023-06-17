export class UpdateFcmTokenEvent {
  public readonly userId: string;
  public readonly fcmToken: string;
  public readonly method: string = 'update-fcm-token';
  public readonly module: string = 'user';

  constructor(partial: Partial<UpdateFcmTokenEvent>) {
    Object.assign(this, partial);
  }
}
