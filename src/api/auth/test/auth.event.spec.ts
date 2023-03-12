import { RegisterEvent } from '../cqrs/event/register.event';

describe('AuthEvent', () => {
  describe('RegisterEvent', () => {
    it('should create a RegisterEvent instance', () => {
      const event = new RegisterEvent('1');
      expect(event.userId).toBe('1');
      expect(event instanceof RegisterEvent).toBe(true);
    });
  });
});
