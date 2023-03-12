export class SetCurrentRefreshTokenCommand {
  constructor(
    public readonly refreshToken: string,
    public readonly userId: string,
  ) {}
}
