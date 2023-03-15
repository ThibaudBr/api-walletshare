import { RegisterCommand } from '../cqrs/command/register.command';
import { SignInDto } from '../dto/sign-in.dto';

describe('AuthCommand', () => {
  describe('RegisterCommand', () => {
    it('should create a RegisterCommand instance', () => {
      const command = new RegisterCommand('test', 'test@mail.com', 'pass');
      expect(command.username).toBe('test');
      expect(command.email).toBe('test@mail.com');
      expect(command.password).toBe('pass');
      expect(command instanceof RegisterCommand).toBe(true);
    });
  });
});

describe('AutDto', () => {
  it('should return true', () => {
    const signin = new SignInDto();
    signin.password = 'hash';
    signin.username = 'billy';
    expect(signin.password).toEqual('hash');
    expect(signin.username).toEqual('billy');
    expect(signin instanceof SignInDto).toBe(true);
  });
});
