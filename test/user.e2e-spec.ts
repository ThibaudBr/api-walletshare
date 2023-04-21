import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppTestE2eModule } from './test-environment/app-test-e2e.module';
import * as request from 'supertest';
import { UserEntity } from '../src/api/user/domain/entities/user.entity';

if (process.env.NODE_ENV != 'test') {
  console.log('NODE_ENV must be set to test');
  throw new Error('NODE_ENV must be set to test');
}

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  let adminToken: string;
  let publicToken: string;

  beforeEach(async () => {
    jest.setTimeout(100000);
    moduleFixture = await Test.createTestingModule({
      imports: [AppTestE2eModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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
  });

  afterEach(async () => {
    await app.close();
  });

  describe(' CreateUser /user/admin/create (POST)', () => {
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/api/test/create-user-test')
        .send({
          username: 'userToTest',
          mail: 'userToTest@test.fr',
          password: 'Test123!',
          roles: ['PUBLIC'],
        })
        .expect(201);
    });

    describe(' Public user should not be able to createUser', () => {
      it('should return 403', async () => {
        await request(app.getHttpServer())
          .post('/user/admin/create')
          .set('Authorization', 'Bearer ' + publicToken)
          .send({
            username: 'test123',
            mail: 'test@test.fr',
            password: 'Test123!',
            roles: ['ADMIN'],
          })
          .expect(403);
      });
    });

    describe(' Not authentified user should not be able to createUser', () => {
      it('should return 401', async function () {
        await request(app.getHttpServer())
          .post('/user/admin/create')
          .send({
            username: 'test123',
            mail: 'test@test.fr',
            password: 'Test123!',
            roles: ['ADMIN'],
          })
          .expect(401);
      });
    });

    describe('Admin user should be able to createUser', () => {
      it('should return a new user admin', async function () {
        const newUser = await request(app.getHttpServer())
          .post('/user/admin/create')
          .set('Authorization', 'Bearer ' + adminToken)
          .send({
            username: 'test123',
            mail: 'test@test.fr',
            password: 'Test123!',
            roles: ['ADMIN'],
          })
          .expect(201);
        expect(newUser).toBeDefined();
        expect(newUser.body).toBeDefined();
        expect(newUser.body.username).toEqual('test123');
        expect(newUser.body.mail).toEqual('test@test.fr');
        expect(newUser.body.roles).toEqual(['ADMIN']);
      });

      it('should return a new user public', async function () {
        const newUser = await request(app.getHttpServer())
          .post('/user/admin/create')
          .set('Authorization', 'Bearer ' + adminToken)
          .send({
            username: 'test123',
            mail: 'test@test.fr',
            password: 'Test123!',
          })
          .expect(201);
        expect(newUser).toBeDefined();
        expect(newUser.body).toBeDefined();
        expect(newUser.body.username).toEqual('test123');
        expect(newUser.body.mail).toEqual('test@test.fr');
        expect(newUser.body.roles).toEqual(['PUBLIC']);
      });

      it('should return User with roles Admin and Public', async function () {
        const newUser = await request(app.getHttpServer())
          .post('/user/admin/create')
          .set('Authorization', 'Bearer ' + adminToken)
          .send({
            username: 'test123',
            mail: 'test@test.fr',
            password: 'Test123!',
            roles: ['ADMIN', 'PUBLIC'],
          })
          .expect(201);
        expect(newUser).toBeDefined();
        expect(newUser.body).toBeDefined();
        expect(newUser.body.username).toEqual('test123');
        expect(newUser.body.mail).toEqual('test@test.fr');
        expect(newUser.body.roles).toEqual(['ADMIN', 'PUBLIC']);
      });
    });

    describe('Admin user should not be able to createUser with invalid Datas', () => {
      it('should return duplicate Username', async function () {
        await request(app.getHttpServer())
          .post('/user/admin/create')
          .set('Authorization', 'Bearer ' + adminToken)
          .send({
            username: 'userToTest',
            mail: 'test@test.fr',
            password: 'Test123!',
          })
          .expect(400)
          .then(response => {
            expect(response.body.message).toEqual('Username already exists');
          });
      });

      it('should return duplicate Mail', async function () {
        await request(app.getHttpServer())
          .post('/user/admin/create')
          .set('Authorization', 'Bearer ' + adminToken)
          .send({
            username: 'userTest',
            mail: 'userToTest@test.fr',
            password: 'Test123!',
          })
          .expect(400)
          .then(response => {
            expect(response.body.message).toEqual('Mail already exists');
          });
      });

      it('should return username is too short', async function () {
        await request(app.getHttpServer())
          .post('/user/admin/create')
          .set('Authorization', 'Bearer ' + adminToken)
          .send({
            username: 'tes',
            mail: 'test@test.fr',
            password: 'Test123!',
          })
          .expect(400)
          .then(response => {
            expect(response.body.message).toEqual('Invalid username exception');
          });
      });

      it('should return username is too long', async function () {
        await request(app.getHttpServer())
          .post('/user/admin/create')
          .set('Authorization', 'Bearer ' + adminToken)
          .send({
            username: 'test123456789101112131415',
            mail: 'test@test.fr',
            password: 'Test123!',
          })
          .expect(400)
          .then(response => {
            expect(response.body.message).toEqual('Invalid username exception');
          });
      });

      it('should return mail is not valid', async function () {
        await request(app.getHttpServer())
          .post('/user/admin/create')
          .set('Authorization', 'Bearer ' + adminToken)
          .send({
            username: 'test123',
            mail: 'testest.fr',
            password: 'Test123!',
          })
          .expect(400)
          .then(response => {
            expect(response.body.message).toEqual('Mail is not valid');
          });
      });

      it('should return password is invalid', async function () {
        await request(app.getHttpServer())
          .post('/user/admin/create')
          .set('Authorization', 'Bearer ' + adminToken)
          .send({
            username: 'test123',
            mail: 'test@test.fr',
            password: 'Test123',
          })
          .expect(400)
          .then(response => {
            expect(response.body.message).toEqual(
              'Invalid password. Password must contain at least 4 characters, at least one uppercase letter, one lowercase letter and one number',
            );
          });
      });
    });
  });

  describe('Generate User /user/admin/generate-user-from-mail (POST) ', () => {
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/api/test/create-user-test')
        .send({
          username: 'userToTest',
          mail: 'userToTest@test.fr',
          password: 'Test123!',
          roles: ['PUBLIC'],
        })
        .expect(201);
    });

    describe('Public user should not be able to generateUser', () => {
      it('should return Forbidden', async function () {
        await request(app.getHttpServer())
          .post('/user/admin/generate-user-from-mail')
          .set('Authorization', 'Bearer ' + publicToken)
          .expect(403);
      });
    });

    describe('Not Authenticated user should not be able to generateUser', () => {
      it('should return Unauthorized', async function () {
        await request(app.getHttpServer()).post('/user/admin/generate-user-from-mail').expect(401);
      });
    });

    describe('Admin user should be able to generateUser', () => {
      it('should return new generatedUser', async function () {
        const newUser = await request(app.getHttpServer())
          .post('/user/admin/generate-user-from-mail')
          .set('Authorization', 'Bearer ' + adminToken)
          .send({
            mail: 'userTest@test.fr',
          })
          .expect(201);

        expect(newUser).toBeDefined();
        expect(newUser.body).toBeDefined();
        expect(newUser.body?.username).toBeNull();
        expect(newUser.body.mail).toEqual('userTest@test.fr');
        expect(newUser.body.roles).toEqual(['PUBLIC']);
      });

      it('should return new generate Admin', function () {
        request(app.getHttpServer())
          .post('/user/admin/generate-user-from-mail')
          .set('Authorization', 'Bearer ' + adminToken)
          .send({
            mail: 'userTest@test.fr',
            roles: ['ADMIN'],
          })
          .expect(201)
          .then(newUser => {
            expect(newUser).toBeDefined();
            expect(newUser.body).toBeDefined();
            expect(newUser.body?.username).toBeNull();
            expect(newUser.body.mail).toEqual('userTest@test.fr');
            expect(newUser.body.roles).toEqual(['ADMIN']);
          });
      });
    });

    describe('Admin user should not be able to generateUser with invalid mail', () => {
      it('should return mail is not valid', function () {
        request(app.getHttpServer())
          .post('/user/admin/generate-user-from-mail')
          .set('Authorization', 'Bearer ' + adminToken)
          .send({
            mail: 'userTesttest.fr',
          })
          .expect(400)
          .then(response => {
            expect(response.body.message).toEqual('Mail is not valid');
          });
      });
    });

    describe('Admin should not be able to generateUser with duplicate mail', () => {
      it('should return mail is already used', async function () {
        await request(app.getHttpServer())
          .post('/user/admin/generate-user-from-mail')
          .set('Authorization', 'Bearer ' + adminToken)
          .send({
            mail: 'userToTest@test.fr',
          })
          .expect(400)
          .then(response => {
            expect(response.body.message).toEqual('Mail already exists');
          });
      });
    });
  });

  describe('Restore User (POST)', () => {
    let userRemovedId: string;
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/api/test/create-user-test')
        .send({
          username: 'userToTest',
          mail: 'userToTest@test.fr',
          password: 'Test123!',
          roles: ['PUBLIC'],
        })
        .expect(201)
        .then(response => {
          userRemovedId = response.body.id;
        });
      await request(app.getHttpServer())
        .delete('/api/test/remove-user-test')
        .send({
          userId: userRemovedId,
        })
        .expect(204);
    });

    describe('Public user should not be able to restoreUser', () => {
      it('should return Forbidden', async function () {
        await request(app.getHttpServer())
          .post('/user/admin/restore-user')
          .set('Authorization', 'Bearer ' + publicToken)
          .expect(403);
      });
    });

    describe('Not Authenticated user should not be able to restoreUser', () => {
      it('should return forbidden', async function () {
        await request(app.getHttpServer()).post('/user/admin/restore-user').expect(401);
      });
    });

    describe('Admin user should be able to restoreUser', () => {
      it('should return 201', async function () {
        await request(app.getHttpServer())
          .post('/user/admin/restore-user')
          .set('Authorization', 'Bearer ' + adminToken)
          .send({
            userId: userRemovedId,
          })
          .expect(204);
        await request(app.getHttpServer())
          .get('/user/admin/' + userRemovedId)
          .set('Authorization', 'Bearer ' + adminToken)
          .expect(200)
          .then(response => {
            expect(response.body).toBeDefined();
            expect(response.body?.username).toEqual('userToTest');
          });
      });
    });

    describe('Admin user should not be able to restoreUser with invalid userId', () => {
      it('should return 400', async function () {
        await request(app.getHttpServer())
          .post('/user/admin/restore-user')
          .set('Authorization', 'Bearer ' + adminToken)
          .send({
            userId: 'invalidId',
          })
          .expect(400)
          .then(response => {
            expect(response.body.message).toEqual('User not found');
          });
      });
    });
  });

  describe('Delete', () => {
    let userToRemoveId: string;
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/api/test/create-user-test')
        .send({
          username: 'userToTest',
          mail: 'userToTest@test.fr',
          password: 'Test123!',
          roles: ['PUBLIC'],
        })
        .expect(201)
        .then(response => {
          userToRemoveId = response.body.id;
        });
    });

    describe('Delete User (DELETE)', () => {
      describe('Public user should not be able to deleteUser', () => {
        it('should return borbiden', async function () {
          await request(app.getHttpServer())
            .delete('/user/admin/' + userToRemoveId)
            .set('Authorization', 'Bearer ' + publicToken)
            .expect(403);

          await request(app.getHttpServer())
            .get('/api/test/get-all-users-test')
            .expect(200)
            .then(response => {
              const userTest = response.body.find((user: UserEntity) => user.id === userToRemoveId);
              expect(userTest).toBeDefined();
              expect(userTest?.deletedAt).toBeNull();
            });
        });
      });

      describe('Not Authenticated user should not be able to deleteUser', () => {
        it('should return borbiden', async function () {
          await request(app.getHttpServer())
            .delete('/user/admin/' + userToRemoveId)
            .expect(401);
          await request(app.getHttpServer())
            .get('/api/test/get-all-users-test')
            .expect(200)
            .then(response => {
              const userTest = response.body.find((user: UserEntity) => user.id === userToRemoveId);
              expect(userTest).toBeDefined();
              expect(userTest?.deletedAt).toBeNull();
            });
        });
      });

      describe('Admin user should be able to deleteUser', () => {
        it('should return 204', async function () {
          await request(app.getHttpServer())
            .delete('/user/admin/' + userToRemoveId)
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(204);
          await request(app.getHttpServer())
            .get('/api/test/get-all-users-test')
            .expect(200)
            .then(response => {
              const userTest = response.body.find((user: UserEntity) => user.id === userToRemoveId);
              expect(userTest).toBeDefined();
              expect(userTest?.deletedAt).toBeDefined();
            });
        });
      });

      describe('Admin user should not be able to deleteUser with invalid userId', () => {
        it('should return error', async function () {
          await request(app.getHttpServer())
            .delete('/user/admin/invalidId')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(400)
            .then(response => {
              expect(response.body.message).toEqual('User not found');
            });
        });
      });
    });

    describe('Delete me /user/public/delete-me', () => {
      describe('Public user should be able to deleteMe', () => {
        it('should return 204', async function () {
          await request(app.getHttpServer())
            .delete('/user/public/delete-me')
            .set('Authorization', 'Bearer ' + publicToken)
            .expect(204);
          await request(app.getHttpServer())
            .get('/api/test/get-all-users-test')
            .expect(200)
            .then(response => {
              const userTest = response.body.find((user: UserEntity) => user.id === userToRemoveId);
              expect(userTest).toBeDefined();
              expect(userTest?.deletedAt).toBeDefined();
            });
        });
      });

      describe('Not Authenticated user should not be able to deleteMe', () => {
        it('should return 403', async function () {
          await request(app.getHttpServer()).delete('/user/public/delete-me').expect(401);
        });
      });
    });
  });

  describe('GET', () => {
    let userCreatedIdList: string[];
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/api/test/create-user-test')
        .send({
          username: 'userToTest1',
          mail: 'userToTest1@test.fr',
          password: 'Test123!',
          roles: ['PUBLIC'],
        })
        .expect(201)
        .then(response => {
          userCreatedIdList = [response.body.id];
        });
      await request(app.getHttpServer())
        .post('/api/test/create-user-test')
        .send({
          username: 'userToTest2',
          mail: 'userToTest2@test.fr',
          password: 'Test123!',
          roles: ['PUBLIC'],
        })
        .expect(201)
        .then(response => {
          userCreatedIdList.push(response.body.id);
        });
      await request(app.getHttpServer())
        .post('/api/test/create-user-test')
        .send({
          username: 'userToTest3',
          mail: 'userToTest3@test.fr',
          password: 'Test123!',
          roles: ['PUBLIC'],
        })
        .expect(201)
        .then(response => {
          userCreatedIdList.push(response.body.id);
        });
      await request(app.getHttpServer())
        .delete('/api/test/remove-user-test')
        .send({
          userId: userCreatedIdList[0],
        })
        .expect(204);
    });

    describe('Get all user admin /user/admin/ (GET)', () => {
      describe('Public user should not be able to getAllUserAdmin', () => {
        it('should return borbiden', async function () {
          await request(app.getHttpServer())
            .get('/user/admin')
            .set('Authorization', 'Bearer ' + publicToken)
            .expect(403);
        });
      });

      describe('Not Authenticated user should not be able to getAllUserAdmin', () => {
        it('should return borbiden', async function () {
          await request(app.getHttpServer()).get('/user/admin').expect(401);
        });
      });

      describe('Admin user should be able to getAllUserAdmin', () => {
        it('should return 200', async function () {
          await request(app.getHttpServer())
            .get('/user/admin')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200)
            .then(response => {
              expect(response.body).toBeDefined();
              expect(response.body.length).toEqual(4);
              expect(response.body[2].username).toEqual('userToTest2');
              expect(response.body[2].deletedAt).toBeNull();
              expect(response.body[3].username).toEqual('userToTest3');
              expect(response.body[3].deletedAt).toBeNull();
            });
        });
      });
    });

    describe('Get user by id admin /user/admin/:userId (GET)', () => {
      describe('Public user should not be able to getUserByIdAdmin', () => {
        it('should return forbiden', async function () {
          await request(app.getHttpServer())
            .get('/user/admin/' + userCreatedIdList[1])
            .set('Authorization', 'Bearer ' + publicToken)
            .expect(403);
        });
      });

      describe('Not Authenticated user should not be able to getUserByIdAdmin', () => {
        it('should return forbiden', async function () {
          await request(app.getHttpServer())
            .get('/user/admin/' + userCreatedIdList[1])
            .expect(401);
        });
      });

      describe('Admin user should be able to getUserByIdAdmin', () => {
        it('should return user', async function () {
          await request(app.getHttpServer())
            .get('/user/admin/' + userCreatedIdList[1])
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200)
            .then(response => {
              expect(response.body).toBeDefined();
              expect(response.body.username).toEqual('userToTest2');
              expect(response.body.deletedAt).toBeNull();
            });
        });
      });

      describe('Admin user should not be able to getUserByIdAdmin with invalid userId', () => {
        it('should return error invalid userId', async function () {
          await request(app.getHttpServer())
            .get('/user/admin/' + 'invalidUserId')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(400)
            .then(response => {
              expect(response.body).toBeDefined();
              expect(response.body.message).toEqual('User not found');
            });
        });
      });

      describe('Admin should not be able to get user deleted', () => {
        it('should return error invalid userId', async function () {
          await request(app.getHttpServer())
            .get('/user/admin/' + userCreatedIdList[0])
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(400)
            .then(response => {
              expect(response.body).toBeDefined();
              expect(response.body.message).toEqual('User not found');
            });
        });
      });
    });

    describe('Admin find user with criteria /user/admin/criteria (GET)', () => {
      describe('Public user should not be able to findUserWithCriteria', () => {
        it('should return forbiden', async function () {
          await request(app.getHttpServer())
            .post('/user/admin/criteria')
            .set('Authorization', 'Bearer ' + publicToken)
            .expect(403);
        });
      });

      describe('Not Authenticated user should not be able to findUserWithCriteria', () => {
        it('should return forbiden', async function () {
          await request(app.getHttpServer()).post('/user/admin/criteria').expect(401);
        });
      });

      describe('Admin user should be able to findUserWithCriteria', () => {
        it('should return all user not deleted', async function () {
          await request(app.getHttpServer())
            .post('/user/admin/criteria')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200)
            .then(response => {
              expect(response.body).toBeDefined();
              expect(response.body.length).toEqual(4);
              expect(response.body[2].username).toEqual('userToTest2');
              expect(response.body[2].deletedAt).toBeNull();
              expect(response.body[3].username).toEqual('userToTest3');
              expect(response.body[3].deletedAt).toBeNull();
            });
        });

        it('should retrun all user with delleted user', async function () {
          await request(app.getHttpServer())
            .post('/user/admin/criteria')
            .set('Authorization', 'Bearer ' + adminToken)
            .send({
              isDeleted: true,
            })
            .expect(200)
            .then(response => {
              expect(response.body).toBeDefined();
              expect(response.body.length).toEqual(5);
            });
        });
      });

      describe('Get me /user/public/get-me (GET)', () => {
        describe('Public user should be able to getMe', () => {
          it('should return user', async function () {
            await request(app.getHttpServer())
              .get('/user/public/get-me')
              .set('Authorization', 'Bearer ' + publicToken)
              .expect(200)
              .then(response => {
                expect(response.body).toBeDefined();
                expect(response.body.username).toEqual('publicTest');
                expect(response.body.deletedAt).toBeNull();
              });
          });
        });

        describe('Not Authenticated user should not be able to getMe', () => {
          it('should return forbiden', async function () {
            await request(app.getHttpServer()).get('/user/public/get-me').expect(401);
          });
        });
      });
    });
  });

  describe('PUT', () => {
    let userCreatedIdList: string[];
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/api/test/create-user-test')
        .send({
          username: 'userToTest1',
          mail: 'userToTest1@test.fr',
          password: 'Test123!',
          roles: ['PUBLIC'],
        })
        .expect(201)
        .then(response => {
          userCreatedIdList = [response.body.id];
        });
      await request(app.getHttpServer())
        .post('/api/test/create-user-test')
        .send({
          username: 'userToTest2',
          mail: 'userToTest2@test.fr',
          password: 'Test123!',
          roles: ['PUBLIC'],
        })
        .expect(201)
        .then(response => {
          userCreatedIdList.push(response.body.id);
        });
      await request(app.getHttpServer())
        .post('/api/test/create-user-test')
        .send({
          username: 'userToTest3',
          mail: 'userToTest3@test.fr',
          password: 'Test123!',
          roles: ['PUBLIC'],
        })
        .expect(201)
        .then(response => {
          userCreatedIdList.push(response.body.id);
        });
      await request(app.getHttpServer())
        .delete('/api/test/remove-user-test')
        .send({
          userId: userCreatedIdList[0],
        })
        .expect(204);
    });

    describe('Admin update user /user/admin/:userId (PUT)', () => {
      describe('Public user should not be able to updateUserAdmin', () => {
        it('should return forbidden', async function () {
          await request(app.getHttpServer())
            .put('/user/admin/' + userCreatedIdList[1])
            .set('Authorization', 'Bearer ' + publicToken)
            .send({
              username: 'userUpdated',
              mail: 'userUpdated@test.fr',
              password: 'Test123!',
            })
            .expect(403);
        });
      });

      describe('Not Authenticated user should not be able to updateUserAdmin', () => {
        it('should return forbidden', async function () {
          await request(app.getHttpServer())
            .put('/user/admin/' + userCreatedIdList[1])
            .send({
              username: 'userUpdated',
              mail: 'userUpdated@test.fr',
              password: 'Test123!',
            })
            .expect(401);
        });
      });

      describe('Admin user should be able to updateUserAdmin', () => {
        describe('when user is not deleted', () => {
          it('should return user updated', async function () {
            await request(app.getHttpServer())
              .put('/user/admin/' + userCreatedIdList[1])
              .set('Authorization', 'Bearer ' + adminToken)
              .send({
                username: 'userUpdated',
                mail: 'userUpdated@test.fr',
                password: 'Test123!',
              })
              .expect(200)
              .then(response => {
                expect(response.body).toBeDefined();
                expect(response.body.username).toEqual('userUpdated');
                expect(response.body.mail).toEqual('userUpdated@test.fr');
                expect(response.body.deletedAt).toBeNull();
              });
          });
        });
      });

      describe('Admin should not be able to update user with same username', () => {
        it('should return duplicated username', async function () {
          await request(app.getHttpServer())
            .put('/user/admin/' + userCreatedIdList[1])
            .set('Authorization', 'Bearer ' + adminToken)
            .send({
              username: 'userToTest3',
              mail: 'udpatedUser@test.fr',
              password: 'Test123!',
            })
            .expect(400)
            .then(response => {
              expect(response.body).toBeDefined();
              expect(response.body.message).toEqual('Username already exists');
            });
        });

        it('should pass when duplicated username is from deleted User', async function () {
          await request(app.getHttpServer())
            .put('/user/admin/' + userCreatedIdList[1])
            .set('Authorization', 'Bearer ' + adminToken)
            .send({
              username: 'userToTest1',
              mail: 'updatedUser@test.fr',
              password: 'Test123!',
            })
            .expect(200)
            .then(response => {
              expect(response.body).toBeDefined();
              expect(response.body.username).toEqual('userToTest1');
              expect(response.body.mail).toEqual('updatedUser@test.fr');
            });
        });
      });

      describe('Admin should not be able to update user with same mail', () => {
        it('should return error duplicated mail', async function () {
          await request(app.getHttpServer())
            .put('/user/admin/' + userCreatedIdList[1])
            .set('Authorization', 'Bearer ' + adminToken)
            .send({
              username: 'updatedUser',
              mail: 'userToTest3@test.fr',
              password: 'Test123!',
            })
            .expect(400)
            .then(response => {
              expect(response.body).toBeDefined();
              expect(response.body.message).toEqual('Mail already exists');
            });
        });

        it('should pass when duplicated mail is from deleted User', async function () {
          await request(app.getHttpServer())
            .put('/user/admin/' + userCreatedIdList[1])
            .set('Authorization', 'Bearer ' + adminToken)
            .send({
              username: 'updatedUser',
              mail: 'userToTest1@test.fr',
              password: 'Test123!',
            })
            .expect(200)
            .then(response => {
              expect(response.body).toBeDefined();
              expect(response.body.username).toEqual('updatedUser');
              expect(response.body.mail).toEqual('userToTest1@test.fr');
            });
        });
      });
    });

    describe('Admin update role user /user/admin/:id/role (PUT)', () => {
      describe('Public user should not be able to updateUserRole', () => {
        it('should return forbidden', async function () {
          await request(app.getHttpServer())
            .put('/user/admin/' + userCreatedIdList[1] + '/role')
            .set('Authorization', 'Bearer ' + publicToken)
            .send({
              roles: ['ADMIN'],
            })
            .expect(403);
        });
      });

      describe('Not Authenticated user should not be able to updateUserRole', () => {
        it('should return forbidden', async function () {
          await request(app.getHttpServer())
            .put('/user/admin/' + userCreatedIdList[1] + '/role')
            .send({
              roles: ['ADMIN'],
            })
            .expect(401);
        });
      });

      describe('Admin user should be able to updateUserRole', () => {
        describe('when user is not deleted', () => {
          it('should return 204', async function () {
            await request(app.getHttpServer())
              .put('/user/admin/' + userCreatedIdList[1] + '/role')
              .set('Authorization', 'Bearer ' + adminToken)
              .send({
                roles: ['ADMIN'],
              })
              .expect(204);
          });
        });
      });

      describe('Admin should not be able to update user with wrong userId', () => {
        it('should return error user not found', async function () {
          await request(app.getHttpServer())
            .put('/user/admin/' + 'wrongUserId' + '/role')
            .set('Authorization', 'Bearer ' + adminToken)
            .send({
              roles: ['ADMIN'],
            })
            .expect(400)
            .then(response => {
              expect(response.body).toBeDefined();
              expect(response.body.message).toEqual('User not found');
            });
        });
      });
    });

    describe('Public update-me user /user/public/update-me (PUT)', () => {
      describe('Public user should be able to updateMe', () => {
        it('should return updated User', async function () {
          await request(app.getHttpServer())
            .put('/user/public/update-me')
            .set('Authorization', 'Bearer ' + publicToken)
            .send({
              username: 'userUpdated',
              mail: 'userUpdated@test.fr',
            })
            .expect(200)
            .then(response => {
              expect(response.body).toBeDefined();
              expect(response.body.username).toEqual('userUpdated');
              expect(response.body.mail).toEqual('userUpdated@test.fr');
            });
        });
      });

      describe('Public user should not be able to updateMe with same username', () => {
        it('should return duplicated username', async function () {
          await request(app.getHttpServer())
            .put('/user/public/update-me')
            .set('Authorization', 'Bearer ' + publicToken)
            .send({
              username: 'userToTest2',
              mail: 'updatedUser@test.fr',
            })
            .expect(400)
            .then(response => {
              expect(response.body).toBeDefined();
              expect(response.body.message).toEqual('Username already exists');
            });
        });

        it('should pass when duplicated username is from deleted User', async function () {
          await request(app.getHttpServer())
            .put('/user/public/update-me')
            .set('Authorization', 'Bearer ' + publicToken)
            .send({
              username: 'userToTest1',
              mail: 'updatedUser@test.fr',
            })
            .expect(200)
            .then(response => {
              expect(response.body).toBeDefined();
              expect(response.body.username).toEqual('userToTest1');
              expect(response.body.mail).toEqual('updatedUser@test.fr');
            });
        });
      });

      describe('Public user should not be able to updateMe with same mail', () => {
        it('should pass when duplicated mail is from deleted User', async function () {
          await request(app.getHttpServer())
            .put('/user/public/update-me')
            .set('Authorization', 'Bearer ' + publicToken)
            .send({
              username: 'updatedUser',
              mail: 'userTest1@test.fr',
            })
            .expect(200)
            .then(response => {
              expect(response.body).toBeDefined();
              expect(response.body.username).toEqual('updatedUser');
              expect(response.body.mail).toEqual('userTest1@test.fr');
            });
        });
      });
    });

    describe('Public update password user /user/public/update-password (PUT)', () => {
      describe('Public user should be able to updatePassword', () => {
        it('should return updated User', async function () {
          await request(app.getHttpServer())
            .put('/user/public/update-password')
            .set('Authorization', 'Bearer ' + publicToken)
            .send({
              newPassword: 'billyBob123!',
              password: 'Test123!',
            })
            .expect(200)
            .then(response => {
              expect(response.body).toBeDefined();
            });
        });
      });

      describe('Public user should not be able to updatePassword with wrong password', () => {
        it('should return error when old password is wrong', async function () {
          await request(app.getHttpServer())
            .put('/user/public/update-password')
            .set('Authorization', 'Bearer ' + publicToken)
            .send({
              password: 'wrongPassword',
              newPassword: 'Test123!',
            })
            .expect(400)
            .then(response => {
              expect(response.body).toBeDefined();
              expect(response.body.message).toEqual(
                'Invalid password. Password must contain at least 4 characters, at least one uppercase letter, one lowercase letter and one number',
              );
            });
        });

        it('should return error when new password is invalid', async function () {
          await request(app.getHttpServer())
            .put('/user/public/update-password')
            .set('Authorization', 'Bearer ' + publicToken)
            .send({
              newPassword: 'wrongPassword',
              password: 'Test123!',
            })
            .expect(400)
            .then(response => {
              expect(response.body).toBeDefined();
              expect(response.body.message).toEqual(
                'Invalid password. Password must contain at least 4 characters, at least one uppercase letter, one lowercase letter and one number',
              );
            });
        });
      });

      describe('Public user should not be able to updatePassword with same password', () => {
        it('should return error same password', async function () {
          await request(app.getHttpServer())
            .put('/user/public/update-password')
            .set('Authorization', 'Bearer ' + publicToken)
            .send({
              password: 'Test123!',
              newPassword: 'Test123!',
            })
            .expect(400)
            .then(response => {
              expect(response.body).toBeDefined();
              expect(response.body.message).toEqual('New password is the same as old password');
            });
        });
      });

      describe('User who is not authenticated should not be able to updatePassword', () => {
        it('should throw forbidden', async function () {
          await request(app.getHttpServer())
            .put('/user/public/update-password')
            .send({
              password: 'Test123!',
              newPassword: 'Test12543!',
            })
            .expect(401)
            .then(response => {
              expect(response.body).toBeDefined();
            });
        });
      });
    });
  });
});
