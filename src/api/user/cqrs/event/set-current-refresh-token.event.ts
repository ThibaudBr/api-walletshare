export class SetCurrentRefreshTokenEvent {
  constructor(
    public readonly module: string = 'user',
    public readonly method: string = 'set-refresh-token-user',
    public readonly refreshToken: string,
    public readonly userId: string,
  ) {}
}
