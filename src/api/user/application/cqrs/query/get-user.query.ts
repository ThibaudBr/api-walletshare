export class GetUserQuery {
  constructor(public readonly userId?: string, public readonly withDeleted: boolean = false) {}
}
