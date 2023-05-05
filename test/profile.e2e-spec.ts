import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppTestE2eModule } from './test-environment/app-test-e2e.module';
import * as request from 'supertest';
import { RoleProfileEnum } from '../src/api/profile/domain/enum/role-profile.enum';
import { UserEntity } from '../src/api/user/domain/entities/user.entity';
import { ProfileEntity } from '../src/api/profile/domain/entities/profile.entity';

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

  beforeAll(async () => {
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
        userId: userIdList[0],
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
        userId: userIdList[1],
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
        userId: userIdList[2],
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
        userId: userIdList[1],
      })
      .expect(201)
      .then(async response => {
        profileIdList.push(response.body.id);
        await request(app.getHttpServer())
          .delete('/api/test/remove-profile-test/' + response.body.id)
          .expect(200);
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
          userId: userToSoftDeleteId,
        })
        .expect(201)
        .then(response => {
          createdProfileId = response.body.id;
        });
      await request(app.getHttpServer())
        .post('/api/test/create-profile-test')
        .send({
          usernameProfile: 'profileTest2',
          roleProfile: RoleProfileEnum.CLASSIC,
          occupationsId: [occupationIdList[0], occupationIdList[1]],
          userId: userToSoftDeleteId,
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
              expect(profile.deletedAt).not.toBeNull();
              expect(new Date(profile.deletedAt)).toBeInstanceOf(Date);
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
        .expect(204);

      await request(app.getHttpServer())
        .get('/api/test/get-all-profiles-test')
        .expect(200)
        .then(response => {
          response.body.forEach((profile: ProfileEntity) => {
            if (profile.user.id === userToSoftDeleteId) {
              expect(profile.deletedAt).toBeDefined();
              expect(new Date(profile.deletedAt)).toBeInstanceOf(Date);
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
          userId: userToSoftDeleteId,
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
              expect(profile.occupations?.length).toBe(2);
              expect(profile.occupations?.[0].deletedAt).not.toBeNull();
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
          expect(response.body.length).toBe(3);
        });
    });

    it('when admin get all profiles, should return 200 and should get a list of occupationResponse and UserResponse', async () => {
      await request(app.getHttpServer())
        .get('/profile/admin')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(3);
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
          expect(response.body[0].id).toBeDefined();
          expect(response.body[0].userId).toBeDefined();
          expect(response.body[0].occupations).toBeDefined();
        });
    });

    it('when admin get profile with user id, should return 200 and should get a list of profileResponse, with profileResponse.user and profileResponse.occupation defined', async () => {
      await request(app.getHttpServer())
        .get('/profile/admin/with-user-id/' + userIdList[0])
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
        .then(response => {
          expect(response.body[0].id).toBeDefined();
          expect(response.body[0].userId).toEqual(userIdList[0]);
          expect(response.body[0].occupations).toBeDefined();
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
          expect(response.body.length).toBe(1);
          expect(response.body[0].id).toBeDefined();
          expect(response.body[0].userId).toBeDefined();
          expect(response.body[0].userId).toBe(userIdList[1]);
          expect(response.body[0].occupations).toBeDefined();
        });
    });

    it('when user logged is ADMIN, should return 200, with all his profile', async () => {
      await request(app.getHttpServer())
        .get('/profile/public/get-my-profiles')
        .set('Authorization', 'Bearer ' + publicToken)
        .expect(200)
        .then(response => {
          expect(response.body.length).toBe(1);
          expect(response.body[0].id).toBeDefined();
          expect(response.body[0].userId).toBeDefined();
          expect(response.body[0].userId).toBe(userIdList[1]);
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
          expect(response.body[0].userId).toBeDefined();
          expect(response.body[0].userId).toBe(userIdList[0]);
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
          expect(response.body.length).toBe(4);
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
          expect(response.body.length).toBe(4);
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
          occupations: [],
          userId: userIdList[0],
          roleProfile: RoleProfileEnum.CLASSIC,
          usernameProfile: 'BillyBob',
        })
        .expect(201);
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
          expect(response.body.message).toBe('User not found');
        });
    });

    it('when user logged is ADMIN, should return 400, because occupationsId contains invalid id', async () => {
      await request(app.getHttpServer())
        .post('/profile/admin/create-profile')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          userId: userIdList[0],
          usernameProfile: 'biilyBob',
          roleProfile: RoleProfileEnum.CLASSIC,
          occupationsId: [occupationIdList[0], 'invalidId'],
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Invalid Id');
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
          expect(response.body.message).toBe(
            'Invalid parameters: usernameProfile must be longer than or equal to 3 characters',
          );
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
          expect(response.body.message).toBe(
            'Invalid parameters: usernameProfile must be shorter than or equal to 30 characters',
          );
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
          usernameProfile: 'bob',
          roleProfile: RoleProfileEnum.CLASSIC,
        })
        .expect(204);
    });

    it('when user logged is ADMIN, should return 400, because id is invalid', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/update-profile/invalidId')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          usernameProfile: 'bob',
          roleProfile: RoleProfileEnum.CLASSIC,
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Invalid Id');
        });
    });

    it('when user logged is ADMIN, should return 400, because roleProfile is invalid', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/update-profile/' + profileIdList[0])
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          usernameProfile: 'bob',
          roleProfile: 'invalidRole',
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe(
            'Invalid parameters: roleProfile must be one of the following values: CLASSIC, PREMIUM, COMPANY',
          );
        });
    });

    it('when user logged is ADMIN, should return 400, because usernameProfile is too short', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/update-profile/' + profileIdList[0])
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          usernameProfile: 'a',
          roleProfile: RoleProfileEnum.CLASSIC,
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe(
            'Invalid parameters: usernameProfile must be longer than or equal to 3 characters',
          );
        });
    });

    it('when user logged is ADMIN, should return 400, because usernameProfile is too long', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/update-profile/' + profileIdList[0])
        .set('Authorization', 'Bearer ' + adminToken)
        .send({
          usernameProfile: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          roleProfile: RoleProfileEnum.CLASSIC,
        })
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe(
            'Invalid parameters: usernameProfile must be shorter than or equal to 30 characters',
          );
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
          expect(response.body.message).toBe('Invalid Id');
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
        .get('/api/test/get-profile-test/' + profileIdList[0])
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
          usernameProfile: 'bob',
          roleProfile: RoleProfileEnum.CLASSIC,
        })
        .expect(204);

      await request(app.getHttpServer())
        .get('/profile/public/get-profile/' + profileIdList[0])
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
        .then(response => {
          expect(response.body.occupations?.length).toEqual(2);
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
        .send({
          profileId: profileIdList[1],
          usernameProfile: 'bob',
        })
        .expect(204);
    });

    it('when user logged is PUBLIC, should return 204, and usernameProfile should be updated', async () => {
      await request(app.getHttpServer())
        .put('/profile/public/update-my-profile')
        .set('Authorization', 'Bearer ' + publicToken)
        .send({
          profileId: profileIdList[1],
          usernameProfile: 'newUsernameProfile',
        })
        .expect(204);

      await request(app.getHttpServer())
        .get('/profile/public/get-my-profiles')
        .set('Authorization', 'Bearer ' + publicToken)
        .expect(200)
        .then(response => {
          expect(response.body[0].usernameProfile).toBe('newUsernameProfile');
        });
    });

    it('when user logged is PUBLIC, should return 403 when trying to update another profile', async () => {
      await request(app.getHttpServer())
        .put('/profile/public/update-my-profile')
        .set('Authorization', 'Bearer ' + publicToken)
        .send({
          profileId: profileIdList[0],
          usernameProfile: 'newUsernameProfile',
        })
        .expect(403)
        .then(response => {
          expect(response.body.message).toBe('Not the owner');
        });
    });

    it('when user logged is PUBLIC, user should be able to update the occupations of his profile', async () => {
      await request(app.getHttpServer())
        .put('/profile/public/update-my-profile')
        .set('Authorization', 'Bearer ' + publicToken)
        .send({
          profileId: profileIdList[1],
          occupationsId: [occupationIdList[0]],
        })
        .expect(204);

      await request(app.getHttpServer())
        .get('/profile/public/get-my-profiles')
        .set('Authorization', 'Bearer ' + publicToken)
        .expect(200)
        .then(response => {
          expect(response.body[0].occupations?.[0].id).toBe(occupationIdList[0]);
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
        .get('/api/test/get-all-profiles-test')
        .expect(200)
        .then(response => {
          response.body.forEach((profile: ProfileEntity) => {
            expect(profile.id).not.toBe(profileIdList[1]);
          });
        });
    });

    it('when user is logged in as ADMIN, should return 404, because profile does not exist', async () => {
      await request(app.getHttpServer())
        .delete('/profile/admin/delete-profile/invalidId')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Invalid Id');
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
            }
          });
        });
    });

    it('when user is logged in as ADMIN, should return 400, because profile does not exist', async () => {
      await request(app.getHttpServer())
        .delete('/profile/admin/soft-delete-profile/invalidId')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Invalid Id');
        });
    });

    it('when user is logged in as ADMIN, should return 404, because profile is already soft-deleted', async () => {
      await request(app.getHttpServer())
        .delete('/profile/admin/soft-delete-profile/' + profileIdList[3])
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Invalid Id');
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
        .put('/profile/admin/restore-profile/' + profileIdList[3])
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(204);

      await request(app.getHttpServer())
        .get('/api/test/get-all-profiles-test')
        .expect(200)
        .then(response => {
          response.body.forEach((profile: ProfileEntity) => {
            if (profile.id === profileIdList[3]) {
              expect(profile.deletedAt).toBeNull();
            }
          });
        });
    });

    it('when user is logged in as ADMIN, should return 404, because profile does not exist', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/restore-profile/invalidId')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Invalid Id');
        });
    });

    it('when user is logged in as ADMIN, should return 404, because profile is not soft-deleted', async () => {
      await request(app.getHttpServer())
        .put('/profile/admin/restore-profile/' + profileIdList[1])
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(400)
        .then(response => {
          expect(response.body.message).toBe('Profile is not soft deleted');
        });
    });
  });
});
