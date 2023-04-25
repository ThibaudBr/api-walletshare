export class GetUserLoginQuery {
  constructor(public readonly username: string, public readonly plainTextPassword: string) {}
}
