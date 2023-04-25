import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppTestE2eModule } from './test-environment/app-test-e2e.module';
import * as request from 'supertest';
import { CreateSocialNetworkRequest } from '../src/api/social-network/web/request/create-social-network.request';
import { GetSocialNetworkWithCriteriaRequest } from '../src/api/social-network/web/request/get-social-network-with-criteria.request';
import { UpdateSocialNetworkRequest } from '../src/api/social-network/web/request/update-social-network.request';

if (process.env.NODE_ENV != 'test') {
  console.log('NODE_ENV must be set to test');
  throw new Error('NODE_ENV must be set to test');
}

describe('SocialNetworkController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  let adminToken: string;
  let publicToken: string;
  let socialNetworkIdList: string[];

  beforeAll(async () => {
    jest.setTimeout(100000);
    moduleFixture = await Test.createTestingModule({
      imports: [AppTestE2eModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await request(app.getHttpServer()).get('/api/test/clear-database-test').expect(200);

    await request(app.getHttpServer())
      .post('/api/test/create-user-test')
      .send({
        username: 'adminTest',
        mail: 'adminTest@test.fr',
        password: 'Test123!',
        roles: ['ADMIN'],
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/api/test/create-user-test')
      .send({
        username: 'publicTest',
        mail: 'publicTest@test.fr',
        password: 'Test123!',
        roles: ['PUBLIC'],
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: 'adminTest',
        password: 'Test123!',
      })
      .expect(200)
      .then(response => {
        adminToken = response.body.currentHashedRefreshToken;
      });
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: 'publicTest',
        password: 'Test123!',
      })
      .expect(200)
      .then(response => {
        publicToken = response.body.currentHashedRefreshToken;
      });

    await request(app.getHttpServer())
      .post('/api/test/create-social-network-test')
      .send({
        name: 'Facebook',
        url: 'https://www.facebook.com/',
        icon: 'facebook',
        color: '#3b5998',
      })
      .expect(201)
      .then(response => {
        socialNetworkIdList = [response.body.id];
      });

    await request(app.getHttpServer())
      .post('/api/test/create-social-network-test')
      .send({
        name: 'Twitter',
        url: 'https://twitter.com/',
        icon: 'twitter',
        color: '#1da1f2',
      })
      .expect(201)
      .then(response => {
        socialNetworkIdList.push(response.body.id);
      });

    await request(app.getHttpServer())
      .post('/api/test/create-social-network-test')
      .send({
        name: 'Instagram',
        url: 'https://www.instagram.com/',
        icon: 'instagram',
        color: '#e1306c',
      })
      .expect(201)
      .then(async response => {
        socialNetworkIdList.push(response.body.id);
        await request(app.getHttpServer())
          .delete(`/api/test/remove-social-network-test/${response.body.id}`)
          .expect(200);
      });
  });

  afterEach(async () => {
    await request(app.getHttpServer()).get('/api/test/clear-database-test').expect(200);
  });

  describe('GET /social-network/public/', () => {
    it('should return all social networks when user is PUBLIC', async () => {
      await request(app.getHttpServer())
        .get('/social-network/public/')
        .set('Authorization', `Bearer ${publicToken}`)
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(2);
        });
    });

    it('should return all social networks when user is ADMIN', async () => {
      await request(app.getHttpServer())
        .get('/social-network/public/')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(2);
        });
    });

    it('should return nothing when user is not logged', async () => {
      await request(app.getHttpServer())
        .get('/social-network/public/')
        .expect(401)
        .then(response => {
          expect(response.body.message).toBe('Unauthorized');
        });
    });
  });

  describe('GET /social-network/public/:id', () => {
    it('should return nothing when user is not logged', async () => {
      await request(app.getHttpServer())
        .get(`/social-network/public/${socialNetworkIdList[0]}`)
        .expect(401)
        .then(response => {
          expect(response.body.message).toBe('Unauthorized');
        });
    });

    it('should return 1 social network when user is PUBLIC', async () => {
      await request(app.getHttpServer())
        .get(`/social-network/public/${socialNetworkIdList[0]}`)
        .set('Authorization', `Bearer ${publicToken}`)
        .expect(200)
        .then(response => {
          expect(response.body.name).toBe('Facebook');
        });
    });

    it('should return 1 social network when user is ADMIN', async () => {
      await request(app.getHttpServer())
        .get(`/social-network/public/${socialNetworkIdList[0]}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then(response => {
          expect(response.body.name).toBe('Facebook');
        });
    });

    it('should return nothing when user is PUBLIC and social network does not exist', async () => {
      await request(app.getHttpServer())
        .get(`/social-network/public/badId`)
        .set('Authorization', `Bearer ${publicToken}`)
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Invalid Id');
        });
    });
  });

  describe('POST /social-network/admin/get-with-criteria', () => {
    it('should return nothing when user is not logged', async () => {
      await request(app.getHttpServer())
        .post('/social-network/admin/get-with-criteria')
        .expect(401)
        .then(response => {
          expect(response.body.message).toBe('Unauthorized');
        });
    });

    it('should return nothing when user is PUBLIC', async () => {
      await request(app.getHttpServer())
        .post('/social-network/admin/get-with-criteria')
        .set('Authorization', `Bearer ${publicToken}`)
        .expect(403)
        .then(response => {
          expect(response.body.message).toBe('Forbidden resource');
        });
    });

    it('should return all social network when user is admin and no criteria', async () => {
      await request(app.getHttpServer())
        .post('/social-network/admin/get-with-criteria')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(2);
        });
    });

    it('should return all social network, even deleted, when user is admin and criteria isDeleted is true', async () => {
      await request(app.getHttpServer())
        .post('/social-network/admin/get-with-criteria')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isDeleted: true })
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(3);
        });
    });

    it('should return an array with 1 social network when user is admin and criteria isDeleted is false and name = Facebook', async () => {
      await request(app.getHttpServer())
        .post('/social-network/admin/get-with-criteria')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isDeleted: false, name: 'Facebook' })
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(1);
          expect(response.body[0].name).toBe('Facebook');
        });
    });

    it('should return an array with 1 social network when user is admin and criteria isDeleted is true and name = Instagram', async () => {
      await request(app.getHttpServer())
        .post('/social-network/admin/get-with-criteria')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isDeleted: true, name: 'Instagram' })
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(1);
          expect(response.body[0].name).toBe('Instagram');
        });
    });
  });

  describe('POST /social-network/admin/create', () => {
    it('should return 403 when user is not logged', async () => {
      await request(app.getHttpServer())
        .post('/social-network/admin/create')
        .send({
          name: 'Facebook',
          url: 'https://www.facebook.fr/',
          icon: 'jesaispas',
          color: '#e1306c',
        })
        .expect(401)
        .then(response => {
          expect(response.body.message).toBe('Unauthorized');
        });
    });

    it('should return 403 when user is PUBLIC', async () => {
      await request(app.getHttpServer())
        .post('/social-network/admin/create')
        .set('Authorization', `Bearer ${publicToken}`)
        .send({
          name: 'Facebook',
          url: 'https://www.facebook.fr/',
          icon: 'jesaispas',
          color: '#e1306c',
        })
        .expect(403)
        .then(response => {
          expect(response.body.message).toBe('Forbidden resource');
        });
    });

    it('should return 201 when user is ADMIN and social network is created', async () => {
      await request(app.getHttpServer())
        .post('/social-network/admin/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'BillyBob',
          url: 'https://www.facebook.fr/',
          icon: 'jesaispas',
          color: '#e1306c',
        })
        .expect(204);
    });

    it('should return 400 when user is ADMIN and social network name already exists', async () => {
      await request(app.getHttpServer())
        .post('/social-network/admin/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Facebook',
          color: '#e1306c',
          url: 'https://www.facebook.com',
          icon: 'facebook',
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Duplicate name');
        });
    });

    it('should return 400 when user is ADMIN and social network name is empty', async () => {
      await request(app.getHttpServer())
        .post('/social-network/admin/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: '',
          color: '#e1306c',
          url: 'https://www.billyBob.com',
          icon: 'billyBob',
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Invalid parameters: name must be longer than or equal to 2 characters');
        });
    });

    it('should return 400 when user is ADMIN and social network color is empty', async () => {
      await request(app.getHttpServer())
        .post('/social-network/admin/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'BillyBob',
          color: '',
          url: 'https://www.BillyBob.com',
          icon: 'BillyBob',
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Invalid parameters: The field must be a valid hexadecimal RGB value');
        });
    });

    it('should return 400 when user is ADMIN and social network url is empty', async () => {
      await request(app.getHttpServer())
        .post('/social-network/admin/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'BillyBob',
          color: '#e1306c',
          url: '',
          icon: 'BillyBob',
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Invalid parameters: url must be a URL address');
        });
    });

    it('should return 400 when user is ADMIN and social network icon is empty', async () => {
      await request(app.getHttpServer())
        .post('/social-network/admin/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'BillyBob',
          color: '#e1306c',
          url: 'https://www.BillyBob.com',
          icon: '',
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Invalid parameters: icon should not be empty');
        });
    });

    it('should return 400 when user is ADMIN and social network url is not valid', async () => {
      await request(app.getHttpServer())
        .post('/social-network/admin/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'BillyBob',
          color: '#e1306c',
          url: 'BillyBob',
          icon: 'BillyBob',
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Invalid parameters: url must be a URL address');
        });
    });

    it('should not throw error when user is ADMIN and social network name is duplicated from soft-deleted social network', async () => {
      await request(app.getHttpServer())
        .post('/social-network/admin/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Instagram',
          color: '#e1306c',
          url: 'https://www.instagram.com',
          icon: 'instagram',
        })
        .expect(204);
    });
  });

  describe('PUT /social-network/admin/update', () => {
    it('should return 403 when user is not logged', async () => {
      await request(app.getHttpServer())
        .put('/social-network/admin/update/' + socialNetworkIdList[0])
        .send({ name: 'Facebook', color: '#e1306c' })
        .expect(401)
        .then(response => {
          expect(response.body.message).toBe('Unauthorized');
        });
    });

    it('should return 403 when user is PUBLIC', async () => {
      await request(app.getHttpServer())
        .put('/social-network/admin/update/' + socialNetworkIdList[0])
        .set('Authorization', `Bearer ${publicToken}`)
        .send({
          name: 'Facebook',
          color: '#e1306c',
          url: 'https://www.facebook.com',
          icon: 'facebook',
        })
        .expect(403)
        .then(response => {
          expect(response.body.message).toBe('Forbidden resource');
        });
    });

    it('should return 204 when user is ADMIN and social network is updated', async () => {
      await request(app.getHttpServer())
        .put('/social-network/admin/update/' + socialNetworkIdList[0])
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Facebook2',
          color: '#e1312c',
          url: 'https://www.facebook.com',
          icon: 'facebook',
        })
        .expect(204);

      await request(app.getHttpServer())
        .get('/api/test/get-social-network-test/' + socialNetworkIdList[0])
        .expect(200)
        .then(response => {
          expect(response.body.name).toEqual('Facebook2');
          expect(response.body.url).toEqual('https://www.facebook.com');
          expect(response.body.icon).toEqual('facebook');
          expect(response.body.color).toEqual('#e1312c');
        });
    });

    it('should return error when user is ADMIN and social network name already exists', async () => {
      await request(app.getHttpServer())
        .put('/social-network/admin/update/' + socialNetworkIdList[1])
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Facebook',
          color: '#e1306c',
          url: 'https://www.facebook.com',
          icon: 'facebook',
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Duplicate name');
        });
    });

    it('should return error when user is ADMIN and social network name is empty', async () => {
      await request(app.getHttpServer())
        .put('/social-network/admin/update/' + socialNetworkIdList[0])
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: '',
          color: '#e1306c',
          url: 'https://www.billyBob.com',
          icon: 'billyBob',
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Invalid parameters: name must be longer than or equal to 2 characters');
        });
    });

    it('should not throw error when user is ADMIN and social network name is duplicated from soft-deleted social network', async () => {
      await request(app.getHttpServer())
        .put('/social-network/admin/update/' + socialNetworkIdList[0])
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Instagram',
          color: '#e1306c',
          url: 'https://www.instagram.com',
          icon: 'instagram',
        })
        .expect(204);
    });

    it('should return error when user is ADMIN and social network id is not valid', async () => {
      await request(app.getHttpServer())
        .put('/social-network/admin/update/' + 'invalidId')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'BillyBob',
          color: '#e1306c',
          url: 'https://www.billyBob.com',
          icon: 'billyBob',
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Invalid Id');
        });
    });
  });

  describe('DELETE /social-network/admin/delete/:id', () => {
    it('should return 403 when user is not logged', async () => {
      await request(app.getHttpServer())
        .delete('/social-network/admin/delete/' + socialNetworkIdList[0])
        .expect(401)
        .then(response => {
          expect(response.body.message).toBe('Unauthorized');
        });
    });

    it('should return 403 when user is PUBLIC', async () => {
      await request(app.getHttpServer())
        .delete('/social-network/admin/delete/' + socialNetworkIdList[0])
        .set('Authorization', `Bearer ${publicToken}`)
        .expect(403)
        .then(response => {
          expect(response.body.message).toBe('Forbidden resource');
        });
    });

    it('should return 204 when user is ADMIN and social network is deleted', async () => {
      await request(app.getHttpServer())
        .delete('/social-network/admin/delete/' + socialNetworkIdList[0])
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    });

    it('should return error when user is ADMIN and social network id is not valid', async () => {
      await request(app.getHttpServer())
        .delete('/social-network/admin/delete/' + 'invalidId')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Invalid Id');
        });
    });
  });

  describe('PUT /social-network/admin/restore/:id', () => {
    it('should return 403 when user is not logged', async () => {
      await request(app.getHttpServer())
        .put('/social-network/admin/restore/' + socialNetworkIdList[0])
        .expect(401)
        .then(response => {
          expect(response.body.message).toBe('Unauthorized');
        });
    });

    it('should return 403 when user is PUBLIC', async () => {
      await request(app.getHttpServer())
        .put('/social-network/admin/restore/' + socialNetworkIdList[0])
        .set('Authorization', `Bearer ${publicToken}`)
        .expect(403)
        .then(response => {
          expect(response.body.message).toBe('Forbidden resource');
        });
    });

    it('should return 204 when user is ADMIN and social network is restored', async () => {
      await request(app.getHttpServer())
        .put('/social-network/admin/restore/' + socialNetworkIdList[2])
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    });

    it('should return error when user is ADMIN and social network id is not valid', async () => {
      await request(app.getHttpServer())
        .put('/social-network/admin/restore/' + 'invalidId')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Invalid Id');
        });
    });

    it('should return error when user is ADMIN and social network is not soft deleted', async () => {
      await request(app.getHttpServer())
        .put('/social-network/admin/restore/' + socialNetworkIdList[1])
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Social network is not soft deleted');
        });
    });
  });
});
