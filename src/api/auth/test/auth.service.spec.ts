import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { mockedJwtService } from '../../../util/mocks/jwt.service.mock';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { mockedConfigService } from '../../../util/mocks/config.service.mock';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { UserRepositoryMock } from '../../../util/mocks/repository/user.repository.mock';

import { UserDto } from '../../user/domain/dto/user.dto';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';

config();

describe('AuthService', () => {
  let app: TestingModule;
  let service: AuthService;
  let bcryptCompare: jest.Mock;
  let userData: UserDto;
  let commandBus: jest.Mock;
  let queryBus: jest.Mock;

  const mockedUser: UserDto = {
    ...{
      id: '1',
      email: 'user@email.com',
      username: 'John',
      password: 'hash',
    },
  };
  beforeEach(async () => {
    commandBus = jest.fn().mockResolvedValue('');
    queryBus = jest.fn().mockResolvedValue('');

    userData = {
      ...mockedUser,
    };
    app = await Test.createTestingModule({
      imports: [
        CqrsModule,
        UserRepositoryMock,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: process.env.JWT_EXPIRATION_TIME,
          },
        }),
        ConfigModule,
      ],
      providers: [
        AuthService,
        {
          provide: CommandBus,
          useValue: {
            execute: commandBus,
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: queryBus,
          },
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
      ],
    }).compile();

    service = await app.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const userId = '1';
      expect(typeof service.getCookieWithJwtToken(userId)).toEqual('object');
    });
    it('should return a string', () => {
      const userId = '1';
      expect(typeof service.getCookieWithJwtRefreshToken(userId)).toEqual(
        'object',
      );
    });
  });

  describe('when registering', () => {
    describe('sign-up', () => {
      beforeEach(() => {
        commandBus.mockResolvedValue(mockedUser);
      });
      it('should  return with registered user', async () => {
        expect(
          await service.signup({
            username: 'jhon',
            email: 'user@email.com',
            password: 'hash',
          }),
        ).toEqual(userData);
      });
    });

    it('should return true ', async () => {
      const plainText = '1234';
      const hash = await bcrypt.hash('1234', 10);
      expect(await service.verifyPassword(plainText, hash)).toEqual(true);
    });

    it('should return false ', async () => {
      const plainText = '4567';
      const hash = await bcrypt.hash('1234', 10);
      expect(await service.verifyPassword(plainText, hash)).toEqual(false);
    });
  });

  describe('when log-out', () => {
    it('should return a string', () => {
      expect(service.getCookieForLogOut()).toEqual([
        'Authentication=; HttpOnly; Path=/; Max-Age=0',
        'Refresh=; HttpOnly; Path=/; Max-Age=0',
      ]);
    });
  });

  describe('The login', () => {
    beforeEach(() => {
      bcryptCompare = jest.fn().mockReturnValue(true);
      (bcrypt.compare as jest.Mock) = bcryptCompare;
    });

    describe('when accessing the data of authenticating user', () => {
      describe('and the provided password is not valid', () => {
        beforeEach(() => {
          bcryptCompare.mockReturnValue(false);
        });
        it('should throw an error', async () => {
          await expect(
            service.login('John', 'strongPassword'),
          ).rejects.toThrow();
        });
      });
      describe('and the provided password is valid', () => {
        beforeEach(() => {
          bcryptCompare.mockReturnValue(true);
        });
        describe('and the user is found in the database', () => {
          beforeEach(() => {
            commandBus.mockResolvedValue(userData);
            queryBus.mockResolvedValue(userData);
          });
          it('should return the user data', async () => {
            const user = await service.login('John', 'hash');
            expect(user).toBe(userData);
          });
        });
        describe('and the user is not found in the database', () => {
          beforeEach(() => {
            queryBus.mockResolvedValue(undefined);
          });
          it('should throw an error', async () => {
            await expect(service.login('John', 'hash')).rejects.toThrow();
          });
        });
      });
    });
  });
});

// Erreur inconnue
// [Nest] 102731  - 03/21/2022, 1:19:46 PM   ERROR [1] 2
// node:internal/process/promises:265
//             triggerUncaughtException(err, true /* fromPromise */);
// ^
//
// [UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "Error: expect(received).rejects.toThrow()
//
// Received promise resolved instead of rejected
// Resolved to value: {"header": {"connection": "close", "content-length": "85", "content-type": "application/json; charset=utf-8", "date": "Mon, 21 Mar 2022 12:19:47 GMT", "etag": "W/\"55-zBmjRowoe1bU6jeUfMplrcgN9TE\"", "x-powered-by": "Express"}, "req": {"data": {"email": "user@email.com", "password": "strongPassword", "username": "test"}, "headers": {"content-type": "application/json"}, "method": "POST", "url": "http://127.0.0.1:43743/auth/signup"}, "status": 500, "text": "{\"statusCode\":500,\"message\":\"Internal Server Error!\",\"error\":\"Internal Server Error\"}"}".] {
// code: 'ERR_UNHANDLED_REJECTION'
// }
