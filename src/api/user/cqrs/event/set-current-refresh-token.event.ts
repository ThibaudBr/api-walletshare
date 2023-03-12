export class SetCurrentRefreshTokenEvent {
  constructor(
    public readonly refreshToken: string,
    public readonly userId: string,
  ) {}
}
