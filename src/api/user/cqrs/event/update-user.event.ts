export class UpdateUserEvent {
  constructor(

    public readonly userId: string,
    public readonly module: string = 'user',
    public readonly action: string = 'create-user',
  ) {}
}
