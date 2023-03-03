import { ErrorCustomEventHandler } from '../error-custom.event-handler';
import { Test } from '@nestjs/testing';
import { logger } from '../../../config/winston-logger.config';

describe('ErrorCustomEventHandler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ErrorEventHandler', () => {
    let handler: ErrorCustomEventHandler;

    beforeEach(async () => {
      const mod = await Test.createTestingModule({
        providers: [ErrorCustomEventHandler],
      }).compile();
      handler = mod.get(ErrorCustomEventHandler);
    });

    describe('handler', () => {
      it('should print correctly', () => {
        const consoleSpy = jest.spyOn(logger, 'error').mockImplementation();
        handler.handle({ localisation: '1', error: '2' });
        expect(consoleSpy).toBeCalledTimes(1);
      });
    });
  });
});
