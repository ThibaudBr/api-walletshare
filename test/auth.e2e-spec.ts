import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppTestE2eModule } from './test-environment/app-test-e2e.module';
import * as request from 'supertest';

if (process.env.NODE_ENV != 'test') {
  console.log('NODE_ENV must be set to test');
  throw new Error('NODE_ENV must be set to test');
}
describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    jest.setTimeout(100000);
    moduleFixture = await Test.createTestingModule({
      imports: [AppTestE2eModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await request(app.getHttpServer()).get('/api/test/clear-database-test').expect(200);
    await app.close();
  });

  describe('Register /api/v1/auth/register (POST)', () => {
    beforeAll(async () => {
      await request(app.getHttpServer()).get('/api/test/clear-database-test').expect(200);
      await request(app.getHttpServer())
        .post('/api/test/create-user-test')
        .send({
          username: 'loginTest',
          email: 'loginTest@test.fr',
          password: 'Test123!',
          roles: ['ADMIN'],
        })
        .expect(201);
      await request(app.getHttpServer())
        .post('/api/test/create-user-test')
        .send({
          username: 'loginTestPublic',
          email: 'loginTestPublic@test.fr',
          password: 'Test123!',
          roles: ['PUBLIC'],
        })
        .expect(201);
    });

    describe('With valid data', () => {
      it('should return new users', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            login: 'loginTest',
            password: 'Test123!',
          })
          .expect(200);
        const responseRegister = await request(app.getHttpServer())
          .post('/auth/register')
          .set('Authorization', 'Bearer ' + response.body.currentHashedRefreshToken)
          .send({
            username: 'testRegister',
            email: 'testRegister@test.fr',
            password: 'Test123!',
          });
        expect(responseRegister.status).toEqual(201);
        expect(responseRegister.body).toHaveProperty('id');
        expect(responseRegister.body.username).toEqual('testRegister');
        expect(responseRegister.body.email).toEqual('testRegister@test.fr');
        expect(responseRegister.body.password).toEqual('');
      });
    });
    describe('With invalid data', () => {
      describe('With invalid email', () => {
        it('should return 400', async () => {
          const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
              login: 'loginTest',
              password: 'Test123!',
            })
            .expect(200);
          const responseRegister = await request(app.getHttpServer())
            .post('/auth/register')
            .set('Authorization', 'Bearer ' + response.body.currentHashedRefreshToken)
            .send({
              username: 'test',
              email: 'testtest.fr',
              password: 'Test123!',
            });
          expect(responseRegister.status).toEqual(400);
        });
        describe('With invalid password', () => {
          it('should return 400', async function () {
            const response = await request(app.getHttpServer())
              .post('/auth/login')
              .send({
                login: 'loginTest',
                password: 'Test123!',
              })
              .expect(200);
            const responseRegister = await request(app.getHttpServer())
              .post('/auth/register')
              .set('Authorization', 'Bearer ' + response.body.currentHashedRefreshToken)
              .send({
                username: 'test',
                email: 'test@test.fr',
                password: 'Test123',
              });
            expect(responseRegister.status).toEqual(400);
          });
        });
        describe('With invalid username', () => {
          it('should return 400', async function () {
            const response = await request(app.getHttpServer())
              .post('/auth/login')
              .send({
                login: 'loginTest',
                password: 'Test123!',
              })
              .expect(200);
            const responseRegister = await request(app.getHttpServer())
              .post('/auth/register')
              .set('Authorization', 'Bearer ' + response.body.currentHashedRefreshToken)
              .send({
                username: 'te',
                email: 'test@test.fr',
                password: 'Test123',
              });
            expect(responseRegister.status).toEqual(400);
          });
        });
      });
    });
  });

  describe('Login /auth/login (POST)', () => {
    beforeAll(async () => {
      await request(app.getHttpServer()).get('/api/test/clear-database-test').expect(200);

      await request(app.getHttpServer())
        .post('/api/test/create-user-test')
        .send({
          username: 'loginTest',
          email: 'loginTest@test.fr',
          password: 'Test123!',
        })
        .expect(201);
    });
    describe('With valid data', () => {
      it('should return new users and refreshToken', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            login: 'loginTest',
            password: 'Test123!',
          })
          .expect(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.username).toEqual('loginTest');
        expect(response.body.password).toEqual('');
        expect(response.body).toHaveProperty('jwtToken');
        expect(response.body).toHaveProperty('currentHashedRefreshToken');
      });
    });
    describe('With invalid data', () => {
      describe('With invalid password', () => {
        it('should return 400', async () => {
          const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
              login: 'loginTest',
              password: 'Test123',
            })
            .expect(400);
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toEqual('Wrong credentials provided');
        });
      });
      describe('With invalid username', () => {
        it('should return 400', async () => {
          const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
              login: 'Inconnue',
              password: 'Test123!',
            })
            .expect(400);
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toEqual('Wrong credentials provided');
        });
      });
    });
  });

  describe('Refresh /auth/refresh (GET)', () => {
    it('should return new accessToken', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: 'loginTest',
          password: 'Test123!',
        })
        .expect(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toEqual('loginTest');
      const newRefreshToken = await request(app.getHttpServer())
        .get('/auth/refresh')
        .set('Authorization', 'Bearer ' + response.body.currentHashedRefreshToken)
        .expect(200);
      expect(newRefreshToken.body).toHaveProperty('currentHashedRefreshToken');
    });

    it('should return 401', async () => {
      const newRefreshToken = await request(app.getHttpServer()).get('/auth/refresh').expect(401);
      expect(newRefreshToken.body).toHaveProperty('message');
      expect(newRefreshToken.body.message).toEqual('Unauthorized');
    });
  });

  describe('Logout /auth/logout (POST)', () => {
    it('should return 204', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: 'loginTest',
          password: 'Test123!',
        })
        .expect(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toEqual('loginTest');
      const logoutResponse = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', 'Bearer ' + response.body.currentHashedRefreshToken)
        .expect(204);
      expect(logoutResponse.body).toEqual({});
    });

    it('should return 401', async () => {
      const logoutResponse = await request(app.getHttpServer()).post('/auth/logout').expect(401);
      expect(logoutResponse.body).toHaveProperty('message');
      expect(logoutResponse.body.message).toEqual('Unauthorized');
    });
  });

  describe('Actual /auth/actual (GET)', () => {
    it('should return users', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: 'loginTest',
          password: 'Test123!',
        })
        .expect(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toEqual('loginTest');
      const actualResponse = await request(app.getHttpServer())
        .get('/auth/actual')
        .set('Authorization', 'Bearer ' + response.body.currentHashedRefreshToken)
        .expect(200);
      expect(actualResponse.body).toHaveProperty('id');
      expect(actualResponse.body.username).toEqual('loginTest');
    });

    it('should return 401', async () => {
      const actualResponse = await request(app.getHttpServer()).get('/auth/actual').expect(401);
      expect(actualResponse.body).toHaveProperty('message');
      expect(actualResponse.body.message).toEqual('Unauthorized');
    });
  });
});
