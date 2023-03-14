export class SetCurrentRefreshTokenEvent {
  constructor(
    public readonly module: string = 'user',
    public readonly action: string = 'create-user',
    public readonly refreshToken: string,
    public readonly userId: string,
  ) {}
}
