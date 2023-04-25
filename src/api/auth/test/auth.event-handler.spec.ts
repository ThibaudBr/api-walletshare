import { RegisterEventHandler } from '../application/cqrs/event-handler/register.event-handler';
import { Test } from '@nestjs/testing';
import { logger } from '../../../util/config/winston-logger.config';
import { UserEntity } from '../../user/domain/entities/user.entity';

describe('AuthEventHandler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  let mockedUser: UserEntity;

  beforeAll(() => {
    mockedUser = new UserEntity();
    mockedUser.id = '1';
    mockedUser.mail = 'user@email.com';
    mockedUser.username = 'billy';
    mockedUser.password = 'hash';
  });

  describe('RegisterEventHandler', () => {
    let handler: RegisterEventHandler;

    beforeEach(async () => {
      const mod = await Test.createTestingModule({
        providers: [RegisterEventHandler],
      }).compile();
      handler = mod.get(RegisterEventHandler);
    });

    describe('handler', () => {
      it('should print correctly', () => {
        const consoleSpy = jest.spyOn(logger, 'info').mockImplementation();
        handler.handle({ userId: '1' });
        expect(consoleSpy).toBeCalledTimes(1);
      });
    });
  });
});
