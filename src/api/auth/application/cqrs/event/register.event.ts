export class RegisterEvent {
  constructor(public readonly userId: string, public readonly method: 'Register', public readonly module: 'Auth') {}
}
