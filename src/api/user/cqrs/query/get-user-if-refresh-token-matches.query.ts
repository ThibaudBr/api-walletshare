export class GetUserIfRefreshTokenMatchesQuery {
  constructor(
    public readonly refreshToken: string,
    public readonly userId: string,
  ) {}
}
