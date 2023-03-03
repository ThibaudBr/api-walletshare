import { ErrorCustomEvent } from '../error-custom.event';

describe('ErrorCustomEvent', () => {
  it('should create an ErrorCustomEvent instance', () => {
    const event = new ErrorCustomEvent('test1', 'error');
    expect(event.localisation).toBe('test1');
    expect(event.error).toBe('error');
  });
});
