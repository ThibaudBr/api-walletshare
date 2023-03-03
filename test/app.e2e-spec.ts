import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppTestE2eModule } from './test-environment/app-test-e2e.module';

if (process.env.NODE_ENV != 'test') {
  console.log('NODE_ENV must be set to test');
  throw new Error('NODE_ENV must be set to test');
}
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    jest.setTimeout(10000);
    moduleFixture = await Test.createTestingModule({
      imports: [AppTestE2eModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await request(app.getHttpServer()).get('/api/test/clear-database-test').expect(200);
  });

  afterAll(async () => {
    await request(app.getHttpServer()).get('/api/test/clear-database-test').expect(200);
    await app.close();
  });

  describe('Hello world', () => {
    it('/ (GET)', async () => {
      const response = await request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
      expect(response).toBeDefined();
      expect(response.status).toEqual(200);
    });
  });
});
