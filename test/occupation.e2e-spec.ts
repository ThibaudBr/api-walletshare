import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppTestE2eModule } from './test-environment/app-test-e2e.module';
import * as request from 'supertest';
import { GetOccupationWithCriteriaRequest } from '../src/api/occupation/web/request/get-occupation-with-criteria.request';
import { CreateOccupationRequest } from '../src/api/occupation/web/request/create-occupation.request';
import { UpdateOccupationRequest } from '../src/api/occupation/web/request/update-occupation.request';

if (process.env.NODE_ENV != 'test') {
  console.log('NODE_ENV must be set to test');
  throw new Error('NODE_ENV must be set to test');
}

describe('OccupationController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  let adminToken: string;
  let publicToken: string;
  let occupationIdList: string[];

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
      .post('/api/test/create-occupation-test')
      .send({
        name: 'occupationTest1',
      })
      .expect(201)
      .then(response => {
        occupationIdList = [response.body.id];
      });
    await request(app.getHttpServer())
      .post('/api/test/create-occupation-test')
      .send({
        name: 'occupationTest2',
      })
      .expect(201)
      .then(response => {
        occupationIdList.push(response.body.id);
      });
    await request(app.getHttpServer())
      .post('/api/test/create-occupation-test')
      .send({
        name: 'occupationTest3',
      })
      .expect(201)
      .then(async response => {
        occupationIdList.push(response.body.id);
        await request(app.getHttpServer())
          .post('/api/test/remove-occupation-test/' + response.body.id)
          .expect(201);
      });
  });

  describe('GET /occupation/public/', () => {
    it('should not return an array of occupation when user is not logged', () => {
      return request(app.getHttpServer())
        .get('/occupation/public/')
        .expect(401)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Unauthorized');
        });
    });
    it('should return an array of occupation when user is public', () => {
      return request(app.getHttpServer())
        .get('/occupation/public/')
        .set('Authorization', `Bearer ${publicToken}`)
        .expect(201)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBe(2);
        });
    });

    it('should return an array of occupation when user is admin', () => {
      return request(app.getHttpServer())
        .get('/occupation/public/')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBe(2);
        });
    });
  });

  describe('GET /occupation/public/:id', () => {
    it('should not return an occupationResponse when user is not logged', () => {
      return request(app.getHttpServer())
        .get(`/occupation/public/${occupationIdList[0]}`)
        .expect(401)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Unauthorized');
        });
    });

    it('should return an occupationResponse with id', () => {
      return request(app.getHttpServer())
        .get(`/occupation/public/${occupationIdList[0]}`)
        .set('Authorization', `Bearer ${publicToken}`)
        .expect(201)
        .expect(res => {
          expect(res.body.id).toBe(occupationIdList[0]);
        });
    });

    it('should return an error when id is not found', () => {
      return request(app.getHttpServer())
        .get(`/occupation/public/${occupationIdList[0]}1`)
        .set('Authorization', `Bearer ${publicToken}`)
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Occupation not found');
        });
    });
  });

  describe('POST /occupation/admin/get-with-criteria', () => {
    it('should not return an array of occupation when user is not logged', () => {
      return request(app.getHttpServer())
        .post('/occupation/admin/get-with-criteria')
        .expect(401)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Unauthorized');
        });
    });

    it('should not return an array of occupation when user is public', () => {
      return request(app.getHttpServer())
        .post('/occupation/admin/get-with-criteria')
        .set('Authorization', `Bearer ${publicToken}`)
        .expect(403)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Forbidden resource');
        });
    });

    it('should return an array of occupation when user is admin without deleted occupation', () => {
      return request(app.getHttpServer())
        .post('/occupation/admin/get-with-criteria')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBe(2);
        });
    });

    it('should return an array of occupation with deleted occupation when user is admin', () => {
      return request(app.getHttpServer())
        .post('/occupation/admin/get-with-criteria')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          isDeleted: true,
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBe(3);
        });
    });

    it('should return an array of occupation with name occupationTest1 when user is admin', () => {
      return request(app.getHttpServer())
        .post('/occupation/admin/get-with-criteria')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'occupationTest1',
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBe(1);
        });
    });

    it('should return an array of occupation with name occupationTest3 and deleted occupation when user is admin', () => {
      return request(app.getHttpServer())
        .post('/occupation/admin/get-with-criteria')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'occupationTest3',
          isDeleted: true,
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBe(1);
        });
    });

    it('should return an array of occupation with name occupationTest4 and deleted occupation when user is admin and expect empty array', () => {
      return request(app.getHttpServer())
        .post('/occupation/admin/get-with-criteria')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'occupationTest4',
          isDeleted: true,
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBe(0);
        });
    });
  });

  describe('POST /occupation/admin/create', () => {
    it('should not create an occupation when user is not logged', () => {
      return request(app.getHttpServer())
        .post('/occupation/admin/create')
        .send({
          name: 'occupationTest4',
        })
        .expect(401)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Unauthorized');
        });
    });
    it('should not create an occupation when user is public', () => {
      return request(app.getHttpServer())
        .post('/occupation/admin/create')
        .set('Authorization', `Bearer ${publicToken}`)
        .send({
          name: 'occupationTest4',
        })
        .expect(403)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Forbidden resource');
        });
    });
    it('should create an occupation when user is admin', () => {
      return request(app.getHttpServer())
        .post('/occupation/admin/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'occupationTest4',
        })
        .expect(201);
    });

    it('should not create an occupation when user is admin and name is already used', () => {
      return request(app.getHttpServer())
        .post('/occupation/admin/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'occupationTest1',
        })
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Duplicate name');
        });
    });

    it('should not create an occupation when user is admin and name is empty', () => {
      return request(app.getHttpServer())
        .post('/occupation/admin/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: '',
        })
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Invalid parameters: name must be longer than or equal to 2 characters');
        });
    });

    it('should not create an occupation when user is admin and name is undefined', () => {
      return request(app.getHttpServer())
        .post('/occupation/admin/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: undefined,
        })
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Invalid parameters: name must be longer than or equal to 2 characters');
        });
    });

    it('should not create an occupation when user is admin and name is too long (max: 25)', () => {
      return request(app.getHttpServer())
        .post('/occupation/admin/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'occupationTest4occupationTest4',
        })
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Invalid parameters: name must be shorter than or equal to 20 characters');
        });
    });

    it('should not create an occupation when user is admin and name is too short (min: 2)', () => {
      return request(app.getHttpServer())
        .post('/occupation/admin/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'o',
        })
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Invalid parameters: name must be longer than or equal to 2 characters');
        });
    });

    it('should be able to create occupation with duplicate name when user is admin and isDeleted is true', () => {
      return request(app.getHttpServer())
        .post('/occupation/admin/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'occupationTest3',
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.name).toBe('occupationTest3');
        });
    });
  });

  describe('PUT /occupation/admin/update/:id', () => {
    let occupationIdToUpdateList: string[] = [];

    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/api/test/create-occupation-test')
        .send({
          name: 'occupationTestToUpdate',
        })
        .expect(201)
        .then(res => {
          occupationIdToUpdateList.push(res.body.id);
        });
    });

    afterEach(async () => {
      occupationIdToUpdateList = [];
    });

    it('should not update an occupation when user is not logged', () => {
      return request(app.getHttpServer())
        .put('/occupation/admin/update/' + occupationIdToUpdateList[0])
        .send(
          new UpdateOccupationRequest({
            name: 'occupationTest4',
          }),
        )
        .expect(401)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Unauthorized');
        });
    });

    it('should not update an occupation when user is public', () => {
      return request(app.getHttpServer())
        .put('/occupation/admin/update/' + occupationIdToUpdateList[0])
        .set('Authorization', `Bearer ${publicToken}`)
        .send({
          name: 'occupationTest4',
        })
        .expect(403)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Forbidden resource');
        });
    });

    it('should update an occupation when user is admin', () => {
      return request(app.getHttpServer())
        .put('/occupation/admin/update/' + occupationIdToUpdateList[0])
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'occupationTest4',
        })
        .expect(204);
    });

    it('should not update an occupation when user is admin and name is already used', () => {
      return request(app.getHttpServer())
        .put('/occupation/admin/update/' + occupationIdToUpdateList[0])
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'occupationTest2',
        })
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Duplicate name');
        });
    });

    it('should not update an occupation when user is admin and name is empty', () => {
      return request(app.getHttpServer())
        .put('/occupation/admin/update/' + occupationIdToUpdateList[0])
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: '',
        })
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Invalid parameters: name must be longer than or equal to 2 characters');
        });
    });

    it('should not update an occupation when user is admin and name is too long (max: 25)', () => {
      return request(app.getHttpServer())
        .put('/occupation/admin/update/' + occupationIdToUpdateList[0])
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'occupationTest4occupationTest4',
        })
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Invalid parameters: name must be shorter than or equal to 20 characters');
        });
    });

    it('should not update an occupation when user is admin and name is too short (min: 2)', () => {
      return request(app.getHttpServer())
        .put('/occupation/admin/update/' + occupationIdToUpdateList[0])
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'o',
        })
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Invalid parameters: name must be longer than or equal to 2 characters');
        });
    });

    it('should not update an occupation when user is admin and id is not valid', () => {
      return request(app.getHttpServer())
        .put('/occupation/admin/update/' + 'invalidId')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'occupationTest4',
        })
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Occupation not found');
        });
    });

    it('should not be able to update an occupation who is soft-deleted', () => {
      return request(app.getHttpServer())
        .put('/occupation/admin/update/' + occupationIdList[2])
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'occupationTest4',
        })
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Occupation not found');
        });
    });
  });

  describe('DELETE /occupation/admin/delete/:id', () => {
    let occupationIdToDelete: string;
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/api/test/create-occupation-test')
        .send({
          name: 'occupationTestToDelete',
        })
        .expect(201)
        .then(res => {
          occupationIdToDelete = res.body.id;
        });
    });

    it('should not delete an occupation when user is not logged', () => {
      return request(app.getHttpServer())
        .delete('/occupation/admin/delete/' + occupationIdToDelete)
        .expect(401)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Unauthorized');
        });
    });

    it('should not delete an occupation when user is public', () => {
      return request(app.getHttpServer())
        .delete('/occupation/admin/delete/' + occupationIdToDelete)
        .set('Authorization', `Bearer ${publicToken}`)
        .expect(403)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Forbidden resource');
        });
    });

    it('should delete an occupation when user is admin', () => {
      return request(app.getHttpServer())
        .delete('/occupation/admin/delete/' + occupationIdToDelete)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    });

    it('should not delete an occupation when user is admin and id is not valid', () => {
      return request(app.getHttpServer())
        .delete('/occupation/admin/delete/' + 'invalidId')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Occupation not found');
        });
    });
  });

  describe('DELETE /occupation/admin/soft-delete/:id', () => {
    let occupationIdToSoftDelete: string;
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/api/test/create-occupation-test')
        .send({
          name: 'occupationTestToSoftDelete',
        })
        .expect(201)
        .then(res => {
          occupationIdToSoftDelete = res.body.id;
        });
    });

    it('should not soft delete an occupation when user is not logged', () => {
      return request(app.getHttpServer())
        .delete('/occupation/admin/soft-delete/' + occupationIdToSoftDelete)
        .expect(401)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Unauthorized');
        });
    });

    it('should not soft delete an occupation when user is public', () => {
      return request(app.getHttpServer())
        .delete('/occupation/admin/soft-delete/' + occupationIdToSoftDelete)
        .set('Authorization', `Bearer ${publicToken}`)
        .expect(403)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Forbidden resource');
        });
    });

    it('should soft delete an occupation when user is admin', () => {
      return request(app.getHttpServer())
        .delete('/occupation/admin/soft-delete/' + occupationIdToSoftDelete)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    });

    it('should not soft delete an occupation when user is admin and id is not valid', () => {
      return request(app.getHttpServer())
        .delete('/occupation/admin/soft-delete/' + 'invalidId')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Occupation not found');
        });
    });

    it('should not soft delete an occupation who is already soft-deleted', async () => {
      await request(app.getHttpServer())
        .delete('/occupation/admin/soft-delete/' + occupationIdToSoftDelete)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
      return request(app.getHttpServer())
        .delete('/occupation/admin/soft-delete/' + occupationIdToSoftDelete)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Occupation not found');
        });
    });
  });

  describe('PUT /occupation/admin/restore/:id', () => {
    let occupationIdToRestore: string;

    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/api/test/create-occupation-test')
        .send({
          name: 'occupationTestToRestore',
        })
        .expect(201)
        .then(res => {
          occupationIdToRestore = res.body.id;
        });
      await request(app.getHttpServer())
        .delete('/occupation/admin/soft-delete/' + occupationIdToRestore)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    });

    it('should not restore an occupation when user is not logged', () => {
      return request(app.getHttpServer())
        .put('/occupation/admin/restore/' + occupationIdToRestore)
        .expect(401)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Unauthorized');
        });
    });

    it('should not restore an occupation when user is public', () => {
      return request(app.getHttpServer())
        .put('/occupation/admin/restore/' + occupationIdToRestore)
        .set('Authorization', `Bearer ${publicToken}`)
        .expect(403)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Forbidden resource');
        });
    });

    it('should restore an occupation when user is admin', () => {
      return request(app.getHttpServer())
        .put('/occupation/admin/restore/' + occupationIdToRestore)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    });

    it('should not restore an occupation when user is admin and id is not valid', () => {
      return request(app.getHttpServer())
        .put('/occupation/admin/restore/' + 'invalidId')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Occupation not found');
        });
    });

    it('should not restore an occupation who is not soft-deleted', async () => {
      return request(app.getHttpServer())
        .put('/occupation/admin/restore/' + occupationIdList[0])
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body.message).toBe('Occupation is not soft deleted');
        });
    });
  });
});
