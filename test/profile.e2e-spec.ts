import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppTestE2eModule } from './test-environment/app-test-e2e.module';
import * as request from 'supertest';
import { RoleProfileEnum } from '../src/api/profile/domain/enum/role-profile.enum';
import { UserResponse } from '../src/api/user/domain/response/user.response';
import { UserEntity } from '../src/api/user/domain/entities/user.entity';
import { ProfileEntity } from '../src/api/profile/domain/entities/profile.entity';
import { GetProfilesWithCriteriaRequest } from '../src/api/profile/domain/request/get-profiles-with-criteria.request';

if (process.env.NODE_ENV != 'test') {
  console.log('NODE_ENV must be set to test');
  throw new Error('NODE_ENV must be set to test');
}

describe('ProfileController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  let adminToken: string;
  let publicToken: string;

  let occupationIdList: string[];
  let userIdList: string[];
  let profileIdList: string[];

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppTestE2eModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/api/test/create-user-test')
      .send({
        username: 'adminTest',
        mail: 'adminTest@test.fr',
        password: 'Test123!',
        roles: ['ADMIN'],
      })
      .expect(201)
      .then(response => {
        userIdList = [response.body.id];
      });
    await request(app.getHttpServer())
      .post('/api/test/create-user-test')
      .send({
        username: 'publicTest',
        mail: 'publicTest@test.fr',
        password: 'Test123!',
        roles: ['PUBLIC'],
      })
      .expect(201)
      .then(response => {
        userIdList.push(response.body.id);
      });
    await request(app.getHttpServer())
      .post('/api/test/create-user-test')
      .send({
        username: 'publicTest2',
        mail: 'publicTest2@test.fr',
        password: 'Test123!',
        roles: ['PUBLIC'],
      })
      .expect(201)
      .then(response => {
        userIdList.push(response.body.id);
      });
    await request(app.getHttpServer())
      .post('/api/test/create-user-test')
      .send({
        username: 'publicTest3',
        mail: 'publicTest3@test.fr',
        password: 'Test123!',
        roles: ['PUBLIC'],
      })
      .expect(201)
      .then(response => {
        userIdList.push(response.body.id);
      });
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

    await request(app.getHttpServer())
      .post('/api/test/create-profile-test')
      .send({
        usernameProfile: 'profileTest1',
        roleProfile: RoleProfileEnum.CLASSIC,
        occupationsId: [occupationIdList[0], occupationIdList[1]],
        idUser: userIdList[0],
      })
      .expect(201)
      .then(response => {
        profileIdList = [response.body.id];
      });
    await request(app.getHttpServer())
      .post('/api/test/create-profile-test')
      .send({
        usernameProfile: 'profileTest2',
        roleProfile: RoleProfileEnum.CLASSIC,
        occupationsId: [occupationIdList[0], occupationIdList[1]],
        idUser: userIdList[1],
      })
      .expect(201)
      .then(response => {
        profileIdList.push(response.body.id);
      });
    await request(app.getHttpServer())
      .post('/api/test/create-profile-test')
      .send({
        usernameProfile: 'profileTest3',
        roleProfile: RoleProfileEnum.CLASSIC,
        occupationsId: [occupationIdList[0], occupationIdList[1]],
        idUser: userIdList[2],
      })
      .expect(201)
      .then(response => {
        profileIdList.push(response.body.id);
      });
    await request(app.getHttpServer())
      .post('/api/test/create-profile-test')
      .send({
        usernameProfile: 'profileTest4',
        roleProfile: RoleProfileEnum.CLASSIC,
        occupationsId: [occupationIdList[0], occupationIdList[1]],
        idUser: userIdList[1],
      })
      .expect(201)
      .then(async response => {
        profileIdList.push(response.body.id);
        await request(app.getHttpServer())
          .delete('/api/test/remove-profile-test/' + response.body.id)
          .expect(200);
      });
  });

  afterEach(async () => {
    await request(app.getHttpServer()).get('/api/test/clear-database-test').expect(200);
    await app.close();
  });

  describe('When admin create user, new profile public should be created', () => {
    it('new user should have a profile public', async () => {
      await request(app.getHttpServer())
        .post('/user/admin/create')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          username: 'userToTest',
          mail: 'userToTest@test.fr',
          password: 'Test123!',
          roles: ['PUBLIC'],
        })
        .expect(201);
      await request(app.getHttpServer())
        .get('/user/admin/')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
        .then(response => {
          response.body.forEach((user: UserResponse) => {
            if (user.username === 'userToTest') {
              expect(user.profiles?.length).toBe(1);
              expect(user.profiles?.[0].roleProfile).toBe('PUBLIC');
            }
          });
        });
    });

    it('when user register, new profile public should be created', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          username: 'userToTest',
          mail: 'userToTest@test.fr',
          password: 'Test123!',
        })
        .expect(201);
      await request(app.getHttpServer())
        .get('/user/admin/')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
        .then(response => {
          response.body.forEach((user: UserResponse) => {
            if (user.username === 'userToTest') {
              expect(user.profiles?.length).toBe(1);
              expect(user.profiles?.[0].roleProfile).toBe('CLASSIC');
            }
          });
        });
    });
  });

  describe('when user is soft deleted, his profile should be soft deleted', () => {
    let userToSoftDeleteId: string;
    let jwtTokenUserToSoftDelete: string;
    let createdProfileId: string;
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/api/test/create-user-test')
        .send({
          username: 'userToSoftDelete',
          mail: 'userToSoftDelete@test.fr',
          password: 'Test123!',
          roles: ['PUBLIC'],
        })
        .expect(201);
      await request(app.getHttpServer())
        .get('/api/test/get-all-users-test')
        .expect(200)
        .then(response => {
          response.body.forEach((user: UserEntity) => {
            if (user.username === 'userToSoftDelete') {
              userToSoftDeleteId = user.id;
            }
          });
        });
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: 'userToSoftDelete',
          password: 'Test123!',
        })
        .expect(200)
        .then(response => {
          jwtTokenUserToSoftDelete = response.body.currentHashedRefreshToken;
        });

      await request(app.getHttpServer())
        .post('/api/test/create-profile-test')
        .send({
          usernameProfile: 'profileTest1',
          roleProfile: RoleProfileEnum.CLASSIC,
          occupationsId: [occupationIdList[0], occupationIdList[1]],
          idUser: userToSoftDeleteId,
        })
        .expect(201)
        .then(response => {
          createdProfileId = response.body.id;
        });
    });

    it('all profile of user should be soft deleted when user call delete-me', async () => {
      await request(app.getHttpServer())
        .delete('/user/public/delete-me/')
        .set('Authorization', 'Bearer ' + jwtTokenUserToSoftDelete)
        .expect(204);
      await request(app.getHttpServer())
        .get('/api/test/get-all-profiles-test')
        .expect(200)
        .then(response => {
          response.body.forEach((profile: ProfileEntity) => {
            if (profile.user.id === userToSoftDeleteId) {
              expect(profile.deletedAt).toBeDefined();
              expect(profile.deletedAt).toBeInstanceOf(Date);
            }
          });
        });
    });

    it('all profile of user should be soft deleted when admin call /user/admin/:id', async () => {
      const profileIdListOfUserToDelete = [];
      await request(app.getHttpServer())
        .get('/api/test/get-user-test/' + userToSoftDeleteId)
        .expect(200)
        .then(response => {
          expect(response.body.profiles).toBeInstanceOf(Array);
          expect(response.body.profiles?.length).toBe(2);
          profileIdListOfUserToDelete.push(response.body.profiles[0].id);
          profileIdListOfUserToDelete.push(response.body.profiles[1].id);
        });
      await request(app.getHttpServer())
        .delete('/user/admin/' + userToSoftDeleteId)
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(201);

      await request(app.getHttpServer())
        .get('/api/test/get-all-profiles-test')
        .expect(200)
        .then(response => {
          response.body.forEach((profile: ProfileEntity) => {
            if (profile.user.id === userToSoftDeleteId) {
              expect(profile.deletedAt).toBeDefined();
              expect(profile.deletedAt).toBeInstanceOf(Date);
            }
          });
        });
    });

    it('when user is deleted, all profile should be deleted', async () => {
      await request(app.getHttpServer())
        .delete('/user/admin/full-delete/' + userToSoftDeleteId)
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(204);

      await request(app.getHttpServer())
        .get('/api/test/get-all-profiles-test')
        .expect(200)
        .then(response => {
          response.body.forEach((profile: ProfileEntity) => {
            expect(profile.id).not.toBe(createdProfileId);
          });
        });
    });
  });

  describe('when occupation is deleted, profile should not be deleted and occupation should be deleted in profile', () => {
    let userToSoftDeleteId: string;
    let jwtTokenUserToSoftDelete: string;
    let createdProfileId: string;
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/user/admin/create')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          username: 'userToSoftDelete',
          mail: 'userToSoftDelete@test.fr',
          password: 'Test123!',
          roles: ['PUBLIC'],
        })
        .expect(201);
      await request(app.getHttpServer())
        .get('/api/test/get-all-users-test')
        .expect(200)
        .then(response => {
          response.body.forEach((user: UserEntity) => {
            if (user.username === 'userToSoftDelete') {
              userToSoftDeleteId = user.id;
            }
          });
        });
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          login: 'userToSoftDelete',
          password: 'Test123!',
        })
        .expect(200)
        .then(response => {
          jwtTokenUserToSoftDelete = response.body.currentHashedRefreshToken;
        });
      await request(app.getHttpServer())
        .post('/api/test/create-profile-test')
        .send({
          usernameProfile: 'profileTest1',
          roleProfile: RoleProfileEnum.CLASSIC,
          occupationsId: [occupationIdList[0], occupationIdList[1]],
          idUser: userToSoftDeleteId,
        })
        .expect(201)
        .then(response => {
          createdProfileId = response.body.id;
        });
    });

    it('when occupation is deleted, profile should not be deleted and occupation should be deleted in profile', async () => {
      await request(app.getHttpServer())
        .delete('/occupation/admin/delete/' + occupationIdList[0])
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(201);

      await request(app.getHttpServer())
        .get('/api/test/get-all-profiles-test')
        .expect(200)
        .then(response => {
          response.body.forEach((profile: ProfileEntity) => {
            if (profile.id === createdProfileId) {
              expect(profile.occupations?.length).toBe(1);
              expect(profile.occupations?.[0].id).toBe(occupationIdList[1]);
            }
          });
        });
    });

    it('when occupation is soft deleted, profile should not be deleted and occupation should be deleted in profile', async () => {
      await request(app.getHttpServer())
        .delete('/occupation/admin/soft-delete/' + occupationIdList[0])
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(204);

      await request(app.getHttpServer())
        .get('/api/test/get-all-profiles-test')
        .expect(200)
        .then(response => {
          response.body.forEach((profile: ProfileEntity) => {
            if (profile.id === createdProfileId) {
              expect(profile.occupations?.length).toBe(1);
              expect(profile.occupations?.[0].id).toBe(occupationIdList[1]);
            }
          });
        });
    });
  });

  describe('GET /profile/admin', () => {
    it('when user is not logged in, should return 401', async () => {
      await request(app.getHttpServer())
        .get('/profile/admin')
        .expect(401)
        .then(response => {
          expect(response.body.message).toBe('Unauthorized');
        });
    });

    it('when user logged is PUBLIC, should return 403', async () => {
      await request(app.getHttpServer())
        .get('/profile/admin')
        .set('Authorization', 'Bearer ' + publicToken)
        .expect(403)
        .then(response => {
          expect(response.body.message).toBe('Forbidden resource');
        });
    });

    it('when user logged is ADMIN, should return 200', async () => {
      await request(app.getHttpServer())
        .get('/profile/admin')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(2);
        });
    });

    it('when admin get all profiles, should return 200 and should get a list of occupationResponse and UserResponse', async () => {
      await request(app.getHttpServer())
        .get('/profile/admin')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(201)
        .then(response => {
          expect(response.body.length).toBe(2);
          expect(response.body[0].occupations).toBeDefined();
          expect(response.body[0].occupations).toBeInstanceOf(Array);
          expect(response.body[0].occupations[0].id).toBeDefined();
          expect(response.body[0].occupations[0].name).toBeDefined();
          expect(response.body[0].occupations[0].name).toBeInstanceOf(String);
          expect(response.body[0].occupations[0].deletedAt).toBeDefined();
          expect(response.body[0].occupations[0].deletedAt).toBeInstanceOf(Date);
          expect(response.body[0].occupations[0].createdAt).toBeDefined();
          expect(response.body[0].occupations[0].createdAt).toBeInstanceOf(Date);
          expect(response.body[0].occupations[0].updatedAt).toBeDefined();
          expect(response.body[0].occupations[0].updatedAt).toBeInstanceOf(Date);
          expect(response.body[0].user).toBeDefined();
          expect(response.body[0].user).toBeInstanceOf(Object);
          expect(response.body[0].user.id).toBeDefined();
          expect(response.body[0].user.username).toBeDefined();
          expect(response.body[0].user.username).toBeInstanceOf(String);
          expect(response.body[0].user.mail).toBeDefined();
          expect(response.body[0].user.mail).toBeInstanceOf(String);
          expect(response.body[0].user.roles).toBeDefined();
          expect(response.body[0].user.roles).toBeInstanceOf(Array);
          expect(response.body[0].user.roles[0]).toBeDefined();
          expect(response.body[0].user.roles[0]).toBeInstanceOf(String);
          expect(response.body[0].user.deletedAt).toBeDefined();
          expect(response.body[0].user.deletedAt).toBeInstanceOf(Date);
          expect(response.body[0].user.createdAt).toBeDefined();
          expect(response.body[0].user.createdAt).toBeInstanceOf(Date);
          expect(response.body[0].user.updatedAt).toBeDefined();
          expect(response.body[0].user.updatedAt).toBeInstanceOf(Date);
        });
    });
  });

  describe('GET /profile/public/:id', () => {
    it('when user is not logged in, should return 401', async () => {
      await request(app.getHttpServer())
        .get('/profile/public/get-profile/' + profileIdList[1])
        .expect(401)
        .then(response => {
          expect(response.body.message).toBe('Unauthorized');
        });
    });

    it('when user logged is PUBLIC, should return 200', async () => {
      await request(app.getHttpServer())
        .get('/profile/public/get-profile/' + profileIdList[1])
        .set('Authorization', 'Bearer ' + publicToken)
        .expect(200)
        .then(response => {
          expect(response.body.id).toBe(profileIdList[1]);
        });
    });

    it('when user logged is ADMIN, should return 200', async () => {
      await request(app.getHttpServer())
        .get('/profile/public/get-profile/' + profileIdList[1])
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
        .then(response => {
          expect(response.body.id).toBe(profileIdList[1]);
          expect(response.body.user.id).toBeDefined();
          expect(response.body.occupations).toBeDefined();
        });
    });
  });

  describe('GET /profile/admin/with-user-id/:id', () => {
    it('when user is not logged in, should return 401', async () => {
      await request(app.getHttpServer())
        .get('/profile/admin/with-user-id/' + userIdList[0])
        .expect(401)
        .then(response => {
          expect(response.body.message).toBe('Unauthorized');
        });
    });

    it('when user logged is PUBLIC, should return 403', async () => {
      await request(app.getHttpServer())
        .get('/profile/admin/with-user-id/' + userIdList[0])
        .set('Authorization', 'Bearer ' + publicToken)
        .expect(403)
        .then(response => {
          expect(response.body.message).toBe('Forbidden resource');
        });
    });

    it('when user logged is ADMIN, should return 200', async () => {
      await request(app.getHttpServer())
        .get('/profile/admin/with-user-id/' + userIdList[0])
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
        .then(response => {
          expect(response.body.id).toBeDefined();
          expect(response.body.user.id).toBeDefined();
          expect(response.body.occupations).toBeDefined();
        });
    });

    it('when admin get profile with user id, should return 200 and should get a list of profileResponse, with profileResponse.user and profileResponse.occupation defined', async () => {
      await request(app.getHttpServer())
        .get('/profile/admin/with-user-id/' + userIdList[0])
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
        .then(response => {
          expect(response.body.id).toBeDefined();
          expect(response.body.user.id).toBeDefined();
          expect(response.body.user.id).toBe(userIdList[0]);
          expect(response.body.occupations).toBeDefined();
        });
    });
  });

  describe('GET /profile/public/get-my-profiles', () => {
    it('when user is not logged in, should return 401', async () => {
      await request(app.getHttpServer())
        .get('/profile/public/get-my-profiles')
        .expect(401)
        .then(response => {
          expect(response.body.message).toBe('Unauthorized');
        });
    });

    it('when user logged is PUBLIC, should return 200, with all his profile', async () => {
      await request(app.getHttpServer())
        .get('/profile/public/get-my-profiles')
        .set('Authorization', 'Bearer ' + publicToken)
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(2);
          expect(response.body[0].id).toBeDefined();
          expect(response.body[0].user.id).toBeDefined();
          expect(response.body[0].user.id).toBe(userIdList[0]);
          expect(response.body[0].occupations).toBeDefined();
        });
    });

    it('when user logged is ADMIN, should return 200, with all his profile', async () => {
      await request(app.getHttpServer())
        .get('/profile/public/get-my-profiles')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(2);
          expect(response.body[0].id).toBeDefined();
          expect(response.body[0].user.id).toBeDefined();
          expect(response.body[0].user.id).toBe(userIdList[0]);
          expect(response.body[0].occupations).toBeDefined();
        });
    });
  });

  describe('POST /profile/admin/get-with-criteria', () => {
    it('when user is not logged in, should return 401', async () => {
      await request(app.getHttpServer())
        .post('/profile/admin/get-with-criteria')
        .send({})
        .expect(401)
        .then(response => {
          expect(response.body.message).toBe('Unauthorized');
        });
    });

    it('when user logged is PUBLIC, should return 403', async () => {
      await request(app.getHttpServer())
        .post('/profile/admin/get-with-criteria')
        .set('Authorization', 'Bearer ' + publicToken)
        .send({})
        .expect(403)
        .then(response => {
          expect(response.body.message).toBe('Forbidden resource');
        });
    });

    it('when user logged is ADMIN, should return 200, with all profile that match the criteria usernameProfile', async () => {
      await request(app.getHttpServer())
        .post('/profile/admin/get-with-criteria')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          usernameProfile: 'profileTest1',
        })
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(1);
          expect(response.body[0].id).toBeDefined();
          expect(response.body[0].user.id).toBeDefined();
          expect(response.body[0].user.id).toBe(userIdList[0]);
          expect(response.body[0].occupations).toBeDefined();
        });
    });

    it('when user logged is ADMIN, should return 200, with all profile that match the criteria isDeleted', async () => {
      await request(app.getHttpServer())
        .post('/profile/admin/get-with-criteria')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          isDeleted: true,
        })
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(3);
          expect(response.body[0].id).toBeDefined();
          expect(response.body[0].user.id).toBeDefined();
          expect(response.body[0].user.id).toBe(userIdList[0]);
          expect(response.body[0].occupations).toBeDefined();
        });
    });

    it('when user logged is ADMIN, should return 200, with all profile that match the criteria isDeleted= true and roleProfile=RoleProfileEnum.CLASSIC', async () => {
      await request(app.getHttpServer())
        .post('/profile/admin/get-with-criteria')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          isDeleted: true,
          roleProfile: RoleProfileEnum.CLASSIC,
        })
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(2);
          expect(response.body[0].id).toBeDefined();
          expect(response.body[0].user.id).toBeDefined();
          expect(response.body[0].user.id).toBe(userIdList[0]);
          expect(response.body[0].occupations).toBeDefined();
        });
    });
  });

  describe('POST /profile/admin/create-profile', () => {
    it('when user is not logged in, should return 401', async () => {
      await request(app.getHttpServer())
        .post('/profile/admin/create-profile')
        .send({})
        .expect(401)
        .then(response => {
          expect(response.body.message).toBe('Unauthorized');
        });
    });

    it('when user logged is PUBLIC, should return 403', async () => {
      await request(app.getHttpServer())
        .post('/profile/admin/create-profile')
        .set('Authorization', 'Bearer ' + publicToken)
        .send({})
        .expect(403)
        .then(response => {
          expect(response.body.message).toBe('Forbidden resource');
        });
    });

    it('when user logged is ADMIN, should return 204', async () => {
      await request(app.getHttpServer())
        .post('/profile/admin/create-profile')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          userId: userIdList[0],
          roleProfile: RoleProfileEnum.CLASSIC,
        })
        .expect(204);
    });

    it('when user logged is ADMIN, should return 400, because userId is not defined', async () => {
      await request(app.getHttpServer())
        .post('/profile/admin/create-profile')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          roleProfile: RoleProfileEnum.CLASSIC,
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('userId is required');
        });
    });

    it('when user logged is ADMIN, should return 204, whith roleProfile undefined in request but set default as CLASSIC', async () => {
      await request(app.getHttpServer())
        .post('/profile/admin/create-profile')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          userId: userIdList[0],
        })
        .expect(204);
      await request(app.getHttpServer())
        .get('/profile/public/get-my-profile')
        .set('Authorization', 'Bearer ' + publicToken)
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(1);
          expect(response.body[0].id).toBeDefined();
          expect(response.body[0].user.id).toBeDefined();
          expect(response.body[0].user.id).toBe(userIdList[0]);
          expect(response.body[0].occupations).toBeDefined();
          expect(response.body[0].roleProfile).toBe(RoleProfileEnum.CLASSIC);
        });
    });

    it('when user logged is ADMIN, should return 400, because occupationsId contains invalid id', async () => {
      await request(app.getHttpServer())
        .post('/profile/admin/create-profile')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          userId: userIdList[0],
          roleProfile: RoleProfileEnum.CLASSIC,
          occupationsId: [occupationIdList[0], 'invalidId'],
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('occupationsId contains invalid id');
        });
    });

    it('when user logged is ADMIN, should return 400, because usernameProfile is too short', async () => {
      await request(app.getHttpServer())
        .post('/profile/admin/create-profile')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          userId: userIdList[0],
          roleProfile: RoleProfileEnum.CLASSIC,
          usernameProfile: 'a',
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('usernameProfile must be longer than or equal to 3 characters');
        });
    });

    it('when user logged is ADMIN, should return 400, because usernameProfile is too long', async () => {
      await request(app.getHttpServer())
        .post('/profile/admin/create-profile')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          userId: userIdList[0],
          roleProfile: RoleProfileEnum.CLASSIC,
          usernameProfile: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('usernameProfile must be shorter than or equal to 30 characters');
        });
    });

    it('when user logged is ADMIN, should return 400, because usernameProfile contain invalid carac', async () => {
      await request(app.getHttpServer())
        .post('/profile/admin/create-profile')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          userId: userIdList[0],
          roleProfile: RoleProfileEnum.CLASSIC,
          usernameProfile: 'a^a!"\'&<>*-+',
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('usernameProfile must match the following: /^[a-zA-Z0-9]+$/');
        });
    });
  });

  describe('PUT /profile/admin/update-profile/:id', () => {
    it('when user is not logged in, should return 401', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/update-profile/' + profileIdList[0])
        .send({})
        .expect(401)
        .then(response => {
          expect(response.body.message).toBe('Unauthorized');
        });
    });

    it('when user logged is PUBLIC, should return 403', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/update-profile/' + profileIdList[0])
        .set('Authorization', 'Bearer ' + publicToken)
        .send({})
        .expect(403)
        .then(response => {
          expect(response.body.message).toBe('Forbidden resource');
        });
    });

    it('when user logged is ADMIN, should return 204', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/update-profile/' + profileIdList[0])
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          roleProfile: RoleProfileEnum.CLASSIC,
        })
        .expect(204);
    });

    it('when user logged is ADMIN, should return 400, because id is invalid', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/update-profile/invalidId')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          roleProfile: RoleProfileEnum.CLASSIC,
        })
        .expect(404)
        .then(response => {
          expect(response.body.message).toBe('Not Found');
        });
    });

    it('when user logged is ADMIN, should return 400, because roleProfile is invalid', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/update-profile/' + profileIdList[0])
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          roleProfile: 'invalidRole',
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('roleProfile must be a valid enum value');
        });
    });

    it('when user logged is ADMIN, should return 400, because usernameProfile is too short', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/update-profile/' + profileIdList[0])
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          usernameProfile: 'a',
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('usernameProfile must be longer than or equal to 3 characters');
        });
    });

    it('when user logged is ADMIN, should return 400, because usernameProfile is too long', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/update-profile/' + profileIdList[0])
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          usernameProfile: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('usernameProfile must be shorter than or equal to 30 characters');
        });
    });

    it('when user logged is ADMIN, should return 400, because id of occupation in occupationsId is invalid', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/update-profile/' + profileIdList[0])
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          occupationsId: ['invalidId'],
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('occupationsId contains invalid id');
        });
    });

    it('when user logged is ADMIN, should return 204, if occupationsId is empty, profile should have no more occupations', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/update-profile/' + profileIdList[0])
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          occupationsId: [],
        })
        .expect(204);

      await request(app.getHttpServer())
        .get('/profile/admin/get-profile/' + profileIdList[0])
        .expect(200)
        .then(response => {
          expect(response.body.occupations).toEqual([]);
        });
    });

    it('when user logged is ADMIN, should return 204, if occupationsId is undefined, profile should have no change', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/update-profile/' + profileIdList[0])
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          roleProfile: RoleProfileEnum.CLASSIC,
        })
        .expect(204);

      await request(app.getHttpServer())
        .get('/profile/admin/get-profile/' + profileIdList[0])
        .expect(200)
        .then(response => {
          expect(response.body.occupations?.[0].id).toEqual(occupationIdList[0]);
        });
    });

    it('when user logged is ADMIN, should return 204, if usernameProfile is undefined, profile should have no change', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/update-profile/' + profileIdList[0])
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          roleProfile: RoleProfileEnum.CLASSIC,
        })
        .expect(204);

      await request(app.getHttpServer())
        .get('/profile/admin/get-profile/' + profileIdList[0])
        .expect(200)
        .then(response => {
          expect(response.body.usernameProfile).toEqual('usernameProfile');
        });
    });
  });

  describe('PUT /profile/public/update-my-profile', () => {
    it('when user is not logged in, should return 401', async () => {
      await request(app.getHttpServer())
        .put('/profile/public/update-my-profile')
        .send({})
        .expect(401)
        .then(response => {
          expect(response.body.message).toBe('Unauthorized');
        });
    });

    it('when user logged is PUBLIC, should return 204', async () => {
      await request(app.getHttpServer())
        .put('/profile/public/update-my-profile')
        .set('Authorization', 'Bearer ' + publicToken)
        .send({})
        .expect(204);
    });

    it('when user logged is PUBLIC, should return 400, because user should not be able to update is roleProfile', async () => {
      await request(app.getHttpServer())
        .put('/profile/public/update-my-profile')
        .set('Authorization', 'Bearer ' + publicToken)
        .send({
          roleProfile: RoleProfileEnum.CLASSIC,
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('roleProfile should not be updated');
        });
    });

    it('when user logged is PUBLIC, should return 204, and usernameProfile should be updated', async () => {
      await request(app.getHttpServer())
        .put('/profile/public/update-my-profile')
        .set('Authorization', 'Bearer ' + publicToken)
        .send({
          id: profileIdList[1],
          usernameProfile: 'newUsernameProfile',
        })
        .expect(204);

      await request(app.getHttpServer())
        .get('/profile/public/get-my-profile')
        .set('Authorization', 'Bearer ' + publicToken)
        .expect(200)
        .then(response => {
          expect(response.body.usernameProfile).toBe('newUsernameProfile');
        });
    });

    it('when user logged is PUBLIC, should return 403 when trying to update another profile', async () => {
      await request(app.getHttpServer())
        .put('/profile/public/update-my-profile')
        .set('Authorization', 'Bearer ' + publicToken)
        .send({
          id: profileIdList[0],
          usernameProfile: 'newUsernameProfile',
        })
        .expect(403)
        .then(response => {
          expect(response.body.message).toBe('Forbidden resource');
        });
    });

    it('when user logged is PUBLIC, user should be able to update the occupations of his profile', async () => {
      await request(app.getHttpServer())
        .put('/profile/public/update-my-profile')
        .set('Authorization', 'Bearer ' + publicToken)
        .send({
          occupationsId: [occupationIdList[0]],
        })
        .expect(204);

      await request(app.getHttpServer())
        .get('/profile/public/get-my-profile')
        .set('Authorization', 'Bearer ' + publicToken)
        .expect(200)
        .then(response => {
          expect(response.body.occupations?.[0].id).toBe(occupationIdList[0]);
        });
    });
  });

  describe('DELETE /profile/admin/delete-profile/:id', () => {
    it('when user is not logged in, should return 401', async () => {
      await request(app.getHttpServer())
        .delete('/profile/admin/delete-profile/' + profileIdList[0])
        .expect(401)
        .then(response => {
          expect(response.body.message).toBe('Unauthorized');
        });
    });

    it('when user is logged in as PUBLIC, should return 403', async () => {
      await request(app.getHttpServer())
        .delete('/profile/admin/delete-profile/' + profileIdList[0])
        .set('Authorization', 'Bearer ' + publicToken)
        .expect(403)
        .then(response => {
          expect(response.body.message).toBe('Forbidden resource');
        });
    });

    it('when user is logged in as ADMIN, should return 204', async () => {
      await request(app.getHttpServer())
        .delete('/profile/admin/delete-profile/' + profileIdList[1])
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(204);

      await request(app.getHttpServer())
        .get('/api/test/get-all-profiles!-test')
        .expect(200)
        .then(response => {
          response.body.forEach((profile: ProfileEntity) => {
            expect(profile.id).not.toBe(profileIdList[1]);
          });
        });
    });

    it('when user is logged in as ADMIN, should return 404, because profile does not exist', async () => {
      await request(app.getHttpServer())
        .delete('/profile/admin/delete-profile/' + profileIdList[1])
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(404)
        .then(response => {
          expect(response.body.message).toBe('Profile not found');
        });
    });
  });

  describe('DELETE /profile/admin/soft-delete-profile/:id', () => {
    it('when user is not logged in, should return 401', async () => {
      await request(app.getHttpServer())
        .delete('/profile/admin/soft-delete-profile/' + profileIdList[0])
        .expect(401)
        .then(response => {
          expect(response.body.message).toBe('Unauthorized');
        });
    });

    it('when user is logged in as PUBLIC, should return 403', async () => {
      await request(app.getHttpServer())
        .delete('/profile/admin/soft-delete-profile/' + profileIdList[0])
        .set('Authorization', 'Bearer ' + publicToken)
        .expect(403)
        .then(response => {
          expect(response.body.message).toBe('Forbidden resource');
        });
    });

    it('when user is logged in as ADMIN, should return 204', async () => {
      await request(app.getHttpServer())
        .delete('/profile/admin/soft-delete-profile/' + profileIdList[1])
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(204);

      await request(app.getHttpServer())
        .get('/api/test/get-all-profiles-test')
        .expect(200)
        .then(response => {
          response.body.forEach((profile: ProfileEntity) => {
            if (profile.id === profileIdList[1]) {
              expect(profile.deletedAt).toBeDefined();
              expect(profile.deletedAt).not.toBeNull();
              expect(profile.deletedAt).toBeInstanceOf(Date)
            }
          });
        });
    });

    it('when user is logged in as ADMIN, should return 404, because profile does not exist', async () => {
      await request(app.getHttpServer())
        .delete('/profile/admin/soft-delete-profile/' + profileIdList[1])
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(404)
        .then(response => {
          expect(response.body.message).toBe('Profile not found');
        });
    });

    it('when user is logged in as ADMIN, should return 404, because profile is already soft-deleted', async () => {
      await request(app.getHttpServer())
        .delete('/profile/admin/soft-delete-profile/' + profileIdList[2])
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(404)
        .then(response => {
          expect(response.body.message).toBe('Profile not found');
        });
    });
  });

  describe('PUT /profile/admin/restore-profile/:id', () => {
    it('when user is not logged in, should return 401', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/restore-profile/' + profileIdList[0])
        .expect(401)
        .then(response => {
          expect(response.body.message).toBe('Unauthorized');
        });
    });

    it('when user is logged in as PUBLIC, should return 403', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/restore-profile/' + profileIdList[0])
        .set('Authorization', 'Bearer ' + publicToken)
        .expect(403)
        .then(response => {
          expect(response.body.message).toBe('Forbidden resource');
        });
    });

    it('when user is logged in as ADMIN, should return 204', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/restore-profile/' + profileIdList[2])
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(204);

      await request(app.getHttpServer())
        .get('/api/test/get-all-profiles-test')
        .expect(200)
        .then(response => {
          response.body.forEach((profile: ProfileEntity) => {
            expect(profile.id).not.toBe(profileIdList[2]);
            if (profile.id === profileIdList[2]) {
              expect(profile.deletedAt).toBeUndefined();
            }
          });
        });
    });

    it('when user is logged in as ADMIN, should return 404, because profile does not exist', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/restore-profile/invalidId')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(404)
        .then(response => {
          expect(response.body.message).toBe('Profile not found');
        });
    });

    it('when user is logged in as ADMIN, should return 404, because profile is not soft-deleted', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/restore-profile/' + profileIdList[1])
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(404)
        .then(response => {
          expect(response.body.message).toBe('Profile is already active');
        });
    });
  });
});
