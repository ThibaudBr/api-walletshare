import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppTestE2eModule } from './test-environment/app-test-e2e.module';
import * as request from 'supertest';
import { RoleProfileEnum } from '../src/api/profile/domain/enum/role-profile.enum';
import { TypeOfCardEnum } from '../src/api/card/domain/enum/type-of-card.enum';
import supertest from 'supertest';
import { CardEntity } from '../src/api/card/domain/entities/card.entity';
import { WhoCanShareCardEnum } from '../src/api/card/domain/enum/who-can-share-card.enum';
import { WhoCanCommunicateWithEnum } from '../src/api/card/domain/enum/who-can-communicate-with.enum';

if (process.env.NODE_ENV != 'test') {
  console.log('NODE_ENV must be set to test');
  throw new Error('NODE_ENV must be set to test');
}

describe('ProfileController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  let adminToken: string;
  let publicToken: string;
  let public2Token: string;
  let public4Token: string;

  let occupationIdList: string[];
  let userIdList: string[];
  let profileIdList: string[];
  let cardIdList: string[];
  let socialNetworkIdList: string[];

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppTestE2eModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    async function createUser(
      username: string,
      mail: string,
      password: string,
      roles: string[],
    ): Promise<supertest.Test> {
      return request(app.getHttpServer())
        .post('/api/test/create-user-test')
        .send({ username, mail, password, roles })
        .expect(201);
    }

    async function loginUser(login: string, password: string): Promise<supertest.Test> {
      return request(app.getHttpServer()).post('/auth/login').send({ login, password }).expect(200);
    }

    async function createOccupation(name: string): Promise<supertest.Test> {
      return request(app.getHttpServer()).post('/api/test/create-occupation-test').send({ name }).expect(201);
    }

    async function createProfile(
      usernameProfile: string,
      roleProfile: RoleProfileEnum,
      occupationsId: string[],
      idUser: string,
    ): Promise<supertest.Test> {
      return request(app.getHttpServer())
        .post('/api/test/create-profile-test')
        .send({ usernameProfile, roleProfile, occupationsId, idUser })
        .expect(201);
    }

    async function createSocialNetwork(
      name: string,
      url: string,
      icon: string,
      color: string,
    ): Promise<supertest.Test> {
      return request(app.getHttpServer())
        .post('/api/test/create-social-network-test')
        .send({ name, url, icon, color })
        .expect(201);
    }

    async function createCard(name: string, typeOfCard: TypeOfCardEnum, profileId: string): Promise<void> {
      await request(app.getHttpServer())
        .post('/api/test/create-card-test')
        .send({
          name: name,
          typeOfCard: typeOfCard,
          profileId: profileId,
        })
        .expect(201)
        .then(response => {
          cardIdList = [response.body.id];
        });
    }

    const adminUser = await createUser('adminTest', 'adminTest@test.fr', 'Test123!', ['ADMIN']);
    userIdList = [adminUser.body.id];

    const public1User = await createUser('public1Test', 'publicTest@test.fr', 'Test123!', ['PUBLIC']);
    userIdList.push(public1User.body.id);

    const public2User = await createUser('public2Test', 'publicTest2@test.fr', 'Test123!', ['PUBLIC']);
    userIdList.push(public2User.body.id);

    const public3User = await createUser('public3Test', 'publicTest3@test.fr', 'Test123!', ['PUBLIC']);
    userIdList.push(public3User.body.id);

    const public4User = await createUser('public4Test', 'publicTest4@test.fr', 'Test123!', ['PUBLIC']);
    userIdList.push(public4User.body.id);

    const adminLogin = await loginUser('adminTest', 'Test123!');
    adminToken = adminLogin.body.currentHashedRefreshToken;

    const public1Login = await loginUser('public1Test', 'Test123!');
    publicToken = public1Login.body.currentHashedRefreshToken;

    const public2Login = await loginUser('public2Test', 'Test123!');
    public2Token = public2Login.body.currentHashedRefreshToken;

    const public4Login = await loginUser('public4Test', 'Test123!');
    public4Token = public4Login.body.currentHashedRefreshToken;

    const occupation1 = await createOccupation('occupationTest1');
    occupationIdList = [occupation1.body.id];

    const occupation2 = await createOccupation('occupationTest2');
    occupationIdList.push(occupation2.body.id);

    const occupation3 = await createOccupation('occupationTest3');
    occupationIdList.push(occupation3.body.id);

    const profile1 = await createProfile(
      'profile1Test1',
      RoleProfileEnum.CLASSIC,
      [occupationIdList[0], occupationIdList[1]],
      userIdList[1],
    );
    profileIdList = [profile1.body.id];

    const profile2 = await createProfile(
      'profile2Test1',
      RoleProfileEnum.COMPANY,
      [occupationIdList[0], occupationIdList[1]],
      userIdList[1],
    );
    profileIdList.push(profile2.body.id);

    const profile3 = await createProfile(
      'profile3Test1',
      RoleProfileEnum.CLASSIC,
      [occupationIdList[0], occupationIdList[1]],
      userIdList[1],
    );
    profileIdList.push(profile3.body.id);

    await request(app.getHttpServer())
      .delete('/api/test/remove-profile-test/' + profile3.body.id)
      .expect(200);

    const profile4 = await createProfile(
      'profile1Test2',
      RoleProfileEnum.COMPANY,
      [occupationIdList[0]],
      userIdList[2],
    );
    profileIdList.push(profile4.body.id);

    const profile5 = await createProfile(
      'profile2Test2',
      RoleProfileEnum.CLASSIC,
      [occupationIdList[0], occupationIdList[1]],
      userIdList[2],
    );
    profileIdList.push(profile5.body.id);

    const profile6 = await createProfile(
      'profile3Test2',
      RoleProfileEnum.CLASSIC,
      [occupationIdList[0], occupationIdList[1]],
      userIdList[2],
    );
    profileIdList.push(profile6.body.id);

    await request(app.getHttpServer())
      .delete('/api/test/remove-profile-test/' + profile6.body.id)
      .expect(200);

    const profile7 = await createProfile(
      'profile1Test3',
      RoleProfileEnum.CLASSIC,
      [occupationIdList[0], occupationIdList[1]],
      userIdList[2],
    );
    profileIdList.push(profile7.body.id);

    await request(app.getHttpServer())
      .delete('/api/test/remove-profile-test/' + profile7.body.id)
      .expect(200);

    const socialNetwork1 = await createSocialNetwork('Facebook', 'https://www.facebook.com/', 'facebook', '#3b5998');
    socialNetworkIdList = [socialNetwork1.body.id];

    const socialNetwork2 = await createSocialNetwork('Twitter', 'https://twitter.com/', 'twitter', '#1da1f2');
    socialNetworkIdList.push(socialNetwork2.body.id);

    const socialNetwork3 = await createSocialNetwork('Instagram', 'https://www.instagram.com/', 'instagram', '#e1306c');
    socialNetworkIdList.push(socialNetwork3.body.id);

    await request(app.getHttpServer())
      .delete(`/api/test/remove-social-network-test/${socialNetwork3.body.id}`)
      .expect(200);

    // Créer les cartes pour chaque profil
    // Profil 1 de l'utilisateur 1
    await createCard('card1Test1WalletShare', TypeOfCardEnum.WALLET_SHARE, profileIdList[1]); // 0
    await createCard('card1Test1Vcard', TypeOfCardEnum.V_CARD, profileIdList[1]); // 1
    await createCard('card2Test1Website', TypeOfCardEnum.WEBSITE, profileIdList[1]); // 2
    await createCard('card3Test1SocialNetwork', TypeOfCardEnum.SOCIAL_NETWORK, profileIdList[1]); // 3

    // Profil 2 de l'utilisateur 1
    await createCard('card1Test2WalletShare', TypeOfCardEnum.WALLET_SHARE, profileIdList[1]); // 4
    await createCard('card1Test2Vcard', TypeOfCardEnum.V_CARD, profileIdList[1]); // 5
    await createCard('card2Test2Website', TypeOfCardEnum.WEBSITE, profileIdList[1]); // 6
    await createCard('card3Test2SocialNetwork', TypeOfCardEnum.SOCIAL_NETWORK, profileIdList[1]); // 7

    // Profil 3 de l'utilisateur 1 DELETED
    await createCard('card1Test3WalletShare', TypeOfCardEnum.WALLET_SHARE, profileIdList[2]); // 8
    await createCard('card1Test3Vcard', TypeOfCardEnum.V_CARD, profileIdList[2]); // 9
    await createCard('card2Test3Website', TypeOfCardEnum.WEBSITE, profileIdList[2]); // 10
    await createCard('card3Test3SocialNetwork', TypeOfCardEnum.SOCIAL_NETWORK, profileIdList[2]); // 11

    for (const cardId of cardIdList.slice(cardIdList.length - 4, cardIdList.length)) {
      await request(app.getHttpServer())
        .delete('/api/test/remove-card-test/' + cardId)
        .expect(200);
    }

    // Profil 1 de l'utilisateur 2
    await createCard('card1Test4WalletShare', TypeOfCardEnum.WALLET_SHARE, profileIdList[3]); // 12
    await createCard('card1Test4Vcard', TypeOfCardEnum.V_CARD, profileIdList[3]); // 13
    await createCard('card2Test4Website', TypeOfCardEnum.WEBSITE, profileIdList[3]); // 14
    await createCard('card3Test4SocialNetwork', TypeOfCardEnum.SOCIAL_NETWORK, profileIdList[3]); // 15

    // Profil 2 de l'utilisateur 2
    await createCard('card1Test5WalletShare', TypeOfCardEnum.WALLET_SHARE, profileIdList[4]); // 16
    await createCard('card1Test5Vcard', TypeOfCardEnum.V_CARD, profileIdList[4]); // 17
    await createCard('card2Test5Website', TypeOfCardEnum.WEBSITE, profileIdList[4]); // 18
    await createCard('card3Test5SocialNetwork', TypeOfCardEnum.SOCIAL_NETWORK, profileIdList[4]); // 19

    // Profil 2 de l'utilisateur 2 DELETED
    await createCard('card1Test6WalletShare', TypeOfCardEnum.WALLET_SHARE, profileIdList[5]); // 20
    await createCard('card1Test6Vcard', TypeOfCardEnum.V_CARD, profileIdList[5]); // 21
    await createCard('card2Test6Website', TypeOfCardEnum.WEBSITE, profileIdList[5]); // 22
    await createCard('card3Test6SocialNetwork', TypeOfCardEnum.SOCIAL_NETWORK, profileIdList[5]); // 23

    for (const cardId of cardIdList.slice(cardIdList.length - 4, cardIdList.length)) {
      await request(app.getHttpServer())
        .delete('/api/test/remove-card-test/' + cardId)
        .expect(200);
    }

    // Profil 1 de l'utilisateur 3
    await createCard('card1Test7WalletShare', TypeOfCardEnum.WALLET_SHARE, profileIdList[6]); // 24
    await createCard('card1Test7Vcard', TypeOfCardEnum.V_CARD, profileIdList[6]); // 25
    await createCard('card2Test7Website', TypeOfCardEnum.WEBSITE, profileIdList[6]); // 26
    await createCard('card3Test7SocialNetwork', TypeOfCardEnum.SOCIAL_NETWORK, profileIdList[6]); // 27

    for (const cardId of cardIdList.slice(cardIdList.length - 4, cardIdList.length)) {
      await request(app.getHttpServer())
        .delete('/api/test/remove-card-test/' + cardId)
        .expect(200);
    }
  });

  afterEach(async () => {
    await request(app.getHttpServer()).get('/api/test/clear-database-test').expect(200);
    await app.close();
  });

  describe('GET getAllCard /card/admin/', () => {
    it('when user is not connected, should return 401', async () => {
      await request(app.getHttpServer()).get('/card/admin/').expect(401);
    });

    it('when user is logged as PUBLIC, should return 403', async () => {
      await request(app.getHttpServer())
        .get('/card/admin/')
        .set('Authorization', 'Bearer ' + publicToken)
        .expect(403);
    });

    it('when user is logged as ADMIN, should return 200, and all card, with relation with owner: ProfileResponse and owner.user', async () => {
      const response = await request(app.getHttpServer())
        .get('/card/admin/')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200);
      expect(response.body).toHaveLength(12);
      expect(response.body[0].owner).toBeDefined();
      expect(response.body[0].owner.user).toBeDefined();
    });
  });

  describe('GET getCardById /card/public/:id', () => {
    describe('when user is not connected', () => {
      it('should return 401', async () => {
        await request(app.getHttpServer()).get('/card/public/1').expect(401);
      });
    });

    describe('when user is connected as ADMIN', () => {
      describe('when card is not found', () => {
        it('should return 404', async () => {
          await request(app.getHttpServer())
            .get('/card/public/' + cardIdList[0])
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(404);
        });
      });

      describe('when card is deleted', () => {
        it('should return 404', async () => {
          await request(app.getHttpServer())
            .get('/card/public/' + cardIdList[1])
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(404);
        });
      });

      describe('when card id is valid', () => {
        it('should return 200, and card with relation with owner: ProfileResponse and owner.user', async () => {
          const response = await request(app.getHttpServer())
            .get('/card/public/' + cardIdList[2])
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200);
          expect(response.body.owner).toBeDefined();
          expect(response.body.owner.user).toBeDefined();
        });
      });
    });

    describe('when user is connected as PUBLIC', () => {
      describe('when card is not found', () => {
        it('should return 404', async () => {
          await request(app.getHttpServer())
            .get('/card/public/' + cardIdList[0])
            .set('Authorization', 'Bearer ' + publicToken)
            .expect(404);
        });
      });

      describe('when card is deleted', () => {
        it('should return 404', async () => {
          await request(app.getHttpServer())
            .get('/card/public/' + cardIdList[1])
            .set('Authorization', 'Bearer ' + publicToken)
            .expect(404);
        });
      });

      describe('when card id is valid', () => {
        it('should return 200, and card with relation with owner: ProfileResponse and owner.user', async () => {
          const response = await request(app.getHttpServer())
            .get('/card/public/' + cardIdList[2])
            .set('Authorization', 'Bearer ' + publicToken)
            .expect(200);
          expect(response.body.owner).toBeDefined();
          expect(response.body.owner.user).toBeDefined();
        });
      });
    });
  });

  describe('GET getAllCardsByUserId /admin/get-all-cards/:userId', () => {
    describe('when user is not connected', () => {
      it('should return 401', async () => {
        await request(app.getHttpServer()).get('/card/admin/get-all-cards/1').expect(401);
      });
    });

    describe('when user is connected as PUBLIC', () => {
      it('should return 403', async () => {
        await request(app.getHttpServer())
          .get('/card/admin/get-all-cards/1')
          .set('Authorization', 'Bearer ' + publicToken)
          .expect(403);
      });
    });

    describe('when user is connected as ADMIN', () => {
      it('when user id is not valid', async () => {
        await request(app.getHttpServer())
          .get('/card/admin/get-all-cards/invalidId')
          .set('Authorization', 'Bearer ' + adminToken)
          .expect(400)
          .then(response => {
            expect(response.body.message).toEqual('User id is not valid');
          });
      });

      it('when user id is from deleted user', async () => {
        await request(app.getHttpServer())
          .get('/card/admin/get-all-cards/' + userIdList[2])
          .set('Authorization', 'Bearer ' + adminToken)
          .expect(404)
          .then(response => {
            expect(response.body.message).toEqual('User not found');
          });
      });

      describe('when user id is valid', () => {
        describe('when user has no card', () => {
          it('should return 200, and empty array', async () => {
            const response = await request(app.getHttpServer())
              .get('/card/admin/get-all-cards/' + userIdList[0])
              .set('Authorization', 'Bearer ' + adminToken)
              .expect(200);
            expect(response.body).toHaveLength(0);
          });
        });

        describe('when user has card', () => {
          it('should return 200, and array of card', async () => {
            const response = await request(app.getHttpServer())
              .get('/card/admin/get-all-cards/' + userIdList[1])
              .set('Authorization', 'Bearer ' + adminToken)
              .expect(200);
            expect(response.body).toHaveLength(4);
          });

          it('should return 200, and array of card with relation with owner: ProfileResponse and owner.user', async () => {
            const response = await request(app.getHttpServer())
              .get('/card/admin/get-all-cards/' + userIdList[1])
              .set('Authorization', 'Bearer ' + adminToken)
              .expect(200);
            expect(response.body[0].owner).toBeDefined();
            expect(response.body[0].owner.user).toBeDefined();
          });
        });
      });
    });
  });

  describe('GET getAllMyCards /card/public/get-all-my-cards', () => {
    describe('when user is not connected', () => {
      it('should return 401', async () => {
        await request(app.getHttpServer()).get('/card/public/get-all-my-cards').expect(401);
      });
    });

    describe('when user is connected as PUBLIC', () => {
      describe('when user has no card', () => {
        it('should return 200, and empty array', async () => {
          const response = await request(app.getHttpServer())
            .get('/card/public/get-all-my-cards')
            .set('Authorization', 'Bearer ' + publicToken)
            .expect(200);
          expect(response.body).toHaveLength(0);
        });
      });

      describe('when user has card', () => {
        it('should return 200, and array of card', async () => {
          const response = await request(app.getHttpServer())
            .get('/card/public/get-all-my-cards')
            .set('Authorization', 'Bearer ' + publicToken)
            .expect(200);
          expect(response.body).toHaveLength(4);
        });
      });

      describe('when user has card', () => {
        it('should return 200, and array of card with relation with owner: ProfileResponse and owner.user', async () => {
          const response = await request(app.getHttpServer())
            .get('/card/public/get-all-my-cards')
            .set('Authorization', 'Bearer ' + publicToken)
            .expect(200);
          expect(response.body[0].owner).toBeDefined();
          expect(response.body[0].owner.user).toBeDefined();
        });
      });
    });

    describe('when user is connected as ADMIN', () => {
      describe('when user has no card', () => {
        it('should return 200, and empty array', async () => {
          const response = await request(app.getHttpServer())
            .get('/card/public/get-all-my-cards')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200);
          expect(response.body).toHaveLength(0);
        });
      });
    });
  });

  describe('GET getAllCardsByProfileId /card/public/get-all-cards-by-profile-id/:profileId', () => {
    describe('when user is not connected', () => {
      it('should return 401', async () => {
        await request(app.getHttpServer()).get('/card/public/get-all-cards-by-profile-id/1').expect(401);
      });
    });

    describe('when user is connected as PUBLIC', () => {
      describe('when profile id is not valid', () => {
        it('should return 400', async () => {
          await request(app.getHttpServer())
            .get('/card/public/get-all-cards-by-profile-id/invalidId')
            .set('Authorization', 'Bearer ' + publicToken)
            .expect(400)
            .then(response => {
              expect(response.body.message).toEqual('Profile id is not valid');
            });
        });
      });

      describe('when profile id is valid', () => {
        describe('when profile id is from another user', () => {
          it('should return 404', async () => {
            await request(app.getHttpServer())
              .get('/card/public/get-all-cards-by-profile-id/' + profileIdList[0])
              .set('Authorization', 'Bearer ' + publicToken)
              .expect(403)
              .then(response => {
                expect(response.body.message).toEqual('You are not allowed to access this profile');
              });
          });
        });

        describe('when profile id is from the user', () => {
          it('should return 200, and array of card', async () => {
            const response = await request(app.getHttpServer())
              .get('/card/public/get-all-cards-by-profile-id/' + profileIdList[1])
              .set('Authorization', 'Bearer ' + publicToken)
              .expect(200);
            expect(response.body).toHaveLength(4);
          });
        });
      });

      describe('when user is connected as ADMIN', () => {
        describe('when profile id is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .get('/card/public/get-all-cards-by-profile-id/invalidId')
              .set('Authorization', 'Bearer ' + adminToken)
              .expect(400)
              .then(response => {
                expect(response.body.message).toEqual('Profile id is not valid');
              });
          });
        });

        describe('when profile id is valid', () => {
          describe('when profile id is from another user', () => {
            it('should return 400, and array of card', async () => {
              await request(app.getHttpServer())
                .get('/card/public/get-all-cards-by-profile-id/' + profileIdList[0])
                .set('Authorization', 'Bearer ' + adminToken)
                .expect(400)
                .then(response => {
                  expect(response.body.message).toEqual('Forbidden resource access');
                });
            });
          });
        });
      });
    });
  });

  describe('GET getAllCardsWithProfileId /card/admin/get-all-cards-with-profile-id/:profileId', () => {
    describe('when user is not connected', () => {
      it('should return 401', async () => {
        await request(app.getHttpServer()).get('/card/admin/get-all-cards-with-profile-id/1').expect(401);
      });
    });

    describe('when user is connected as PUBLIC', () => {
      it('should return 403', async () => {
        await request(app.getHttpServer())
          .get('/card/admin/get-all-cards-with-profile-id/1')
          .set('Authorization', 'Bearer ' + publicToken)
          .expect(403);
      });
    });

    describe('when user is connected as ADMIN', () => {
      describe('when profile id is not valid', () => {
        it('should return 400', async () => {
          await request(app.getHttpServer())
            .get('/card/admin/get-all-cards-with-profile-id/invalidId')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(400)
            .then(response => {
              expect(response.body.message).toEqual('Profile id is not valid');
            });
        });
      });

      describe('when profile id is valid', () => {
        describe('when profile id is from another user', () => {
          it('should return 200, and array of card', async () => {
            await request(app.getHttpServer())
              .get('/card/admin/get-all-cards-with-profile-id/' + profileIdList[0])
              .set('Authorization', 'Bearer ' + adminToken)
              .expect(200)
              .then(response => {
                expect(response.body).toHaveLength(4);
              });
          });
        });

        describe('when profile id is from soft deleted user', () => {
          it('should return 200, and array of card', async () => {
            await request(app.getHttpServer())
              .get('/card/admin/get-all-cards-with-profile-id/' + profileIdList[2])
              .set('Authorization', 'Bearer ' + adminToken)
              .expect(200)
              .then(response => {
                expect(response.body).toHaveLength(4);
              });
          });
        });

        describe('when profile has no card', () => {
          it('should return 200, and empty array', async () => {
            await request(app.getHttpServer())
              .get('/card/admin/get-all-cards-with-profile-id/' + profileIdList[3])
              .set('Authorization', 'Bearer ' + adminToken)
              .expect(200)
              .then(response => {
                expect(response.body).toHaveLength(0);
              });
          });
        });
      });
    });
  });

  describe('POST getAllCardsWithCriteria /card/admin/get-with-criteria', () => {
    describe('when user is not connected', () => {
      it('should return 401', async () => {
        await request(app.getHttpServer()).post('/card/admin/get-with-criteria').expect(401);
      });
    });

    describe('when user is connected as PUBLIC', () => {
      it('should return 403', async () => {
        await request(app.getHttpServer())
          .post('/card/admin/get-with-criteria')
          .set('Authorization', 'Bearer ' + publicToken)
          .expect(403);
      });
    });

    describe('when user is connected as ADMIN', () => {
      it('when criteria is not valid', async () => {
        await request(app.getHttpServer())
          .post('/card/admin/get-with-criteria')
          .set('Authorization', 'Bearer ' + adminToken)
          .send({ criteria: 'invalidCriteria' })
          .expect(400)
          .then(response => {
            expect(response.body.message).toEqual('Criteria is not valid');
          });
      });

      describe('when criteria is valid', () => {
        it('when criteria is empty', async () => {
          await request(app.getHttpServer())
            .post('/card/admin/get-with-criteria')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200)
            .then(response => {
              expect(response.body).toHaveLength(12);
            });
        });

        describe('when criteria is not empty', () => {
          describe('when isDeleted is true', () => {
            it('should return 200, and array of card', async () => {
              await request(app.getHttpServer())
                .post('/card/admin/get-with-criteria')
                .set('Authorization', 'Bearer ' + adminToken)
                .send({ isDeleted: true })
                .expect(200)
                .then(response => {
                  expect(response.body).toHaveLength(21);
                });
            });
          });

          describe('when get by typeOfCardEnum', () => {
            it('when typeOfCardEnum is TypeOfCardEnum.WALLET_SHARE', async () => {
              await request(app.getHttpServer())
                .post('/card/admin/get-with-criteria')
                .set('Authorization', 'Bearer ' + adminToken)
                .send({ typeOfCardEnum: TypeOfCardEnum.WALLET_SHARE })
                .expect(200)
                .then(response => {
                  expect(response.body[0].typeOfCardEnum).toEqual(TypeOfCardEnum.WALLET_SHARE);
                });
            });

            it('when typeOfCardEnum is TypeOfCardEnum.V_CARD', async () => {
              await request(app.getHttpServer())
                .post('/card/admin/get-with-criteria')
                .set('Authorization', 'Bearer ' + adminToken)
                .send({ typeOfCardEnum: TypeOfCardEnum.V_CARD })
                .expect(200)
                .then(response => {
                  expect(response.body[0].typeOfCardEnum).toEqual(TypeOfCardEnum.V_CARD);
                });
            });

            it('when typeOfCardEnum is TypeOfCardEnum.WEBSITE', async () => {
              await request(app.getHttpServer())
                .post('/card/admin/get-with-criteria')
                .set('Authorization', 'Bearer ' + adminToken)
                .send({ typeOfCardEnum: TypeOfCardEnum.WEBSITE })
                .expect(200)
                .then(response => {
                  expect(response.body[0].typeOfCardEnum).toEqual(TypeOfCardEnum.WEBSITE);
                });
            });

            it('when typeOfCardEnum is TypeOfCardEnum.SOCIAL_NETWORK', async () => {
              await request(app.getHttpServer())
                .post('/card/admin/get-with-criteria')
                .set('Authorization', 'Bearer ' + adminToken)
                .send({ typeOfCardEnum: TypeOfCardEnum.SOCIAL_NETWORK })
                .expect(200)
                .then(response => {
                  expect(response.body[0].typeOfCardEnum).toEqual(TypeOfCardEnum.SOCIAL_NETWORK);
                });
            });
          });

          describe('when get by profileId and isDeleted True', () => {
            it('should return 200, and array of card', async () => {
              await request(app.getHttpServer())
                .post('/card/admin/get-with-criteria')
                .set('Authorization', 'Bearer ' + adminToken)
                .send({ profileId: profileIdList[1], isDeleted: true })
                .expect(200)
                .then(response => {
                  expect(response.body).toHaveLength(12);
                });
            });
          });

          describe('when get by typeOfCardEnum and isDeleted True', () => {
            it('should return 200, and array of card', async () => {
              await request(app.getHttpServer())
                .post('/card/admin/get-with-criteria')
                .set('Authorization', 'Bearer ' + adminToken)
                .send({ typeOfCardEnum: TypeOfCardEnum.WALLET_SHARE, isDeleted: true })
                .expect(200)
                .then(response => {
                  expect(response.body).toHaveLength(6);
                });
            });
          });
        });
      });
    });
  });

  describe('SavedCard Test', () => {
    const listOfSavedCardId = [];

    beforeEach(async () => {
      async function addSavedCard(cardId: string, profileId: string): Promise<supertest.Test> {
        return request(app.getHttpServer())
          .post('/api/test/add-saved-card-test')
          .send({
            cardId: cardId,
            profileId: profileId,
          })
          .expect(201)
          .then(response => {
            listOfSavedCardId.push(response.body.id);
            return response;
          });
      }

      async function removeSavedCard(cardId: string, profileId: string): Promise<supertest.Test> {
        return request(app.getHttpServer())
          .post('/api/test/remove-saved-card-test')
          .send({
            cardId: cardId,
            profileId: profileId,
          })
          .expect(200);
      }

      await addSavedCard(cardIdList[12], profileIdList[0]);
      await addSavedCard(cardIdList[13], profileIdList[0]);
      await addSavedCard(cardIdList[14], profileIdList[0]);
      await addSavedCard(cardIdList[15], profileIdList[0]);

      await addSavedCard(cardIdList[16], profileIdList[0]);
      await addSavedCard(cardIdList[17], profileIdList[0]);
      await addSavedCard(cardIdList[18], profileIdList[0]);
      await addSavedCard(cardIdList[19], profileIdList[0]);

      await addSavedCard(cardIdList[20], profileIdList[0]);
      await addSavedCard(cardIdList[21], profileIdList[0]);
      await addSavedCard(cardIdList[22], profileIdList[0]);
      await addSavedCard(cardIdList[23], profileIdList[0]);

      await removeSavedCard(cardIdList[20], profileIdList[0]);
      await removeSavedCard(cardIdList[21], profileIdList[0]);
      await removeSavedCard(cardIdList[22], profileIdList[0]);
      await removeSavedCard(cardIdList[23], profileIdList[0]);
    });

    describe('GET getSavedCardsWithUserId /admin/get-saved-cards-with-user-id/:userId', () => {
      describe('when user is not connected', () => {
        it('should return 401', async () => {
          await request(app.getHttpServer())
            .get('/card/admin/get-saved-cards-with-user-id/' + userIdList[0])
            .expect(401);
        });
      });

      describe('when user is connected as PUBLIC', () => {
        it('should return 403', async () => {
          await request(app.getHttpServer())
            .get('/card/admin/get-saved-cards-with-user-id/' + userIdList[0])
            .set('Authorization', 'Bearer ' + publicToken)
            .expect(403);
        });
      });

      describe('when user is connected as ADMIN', () => {
        describe('when userId is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .get('/card/admin/get-saved-cards-with-user-id/' + 'not-valid-id')
              .set('Authorization', 'Bearer ' + adminToken)
              .expect(400);
          });
        });

        describe('when userId is valid', () => {
          it('should return 200', async () => {
            await request(app.getHttpServer())
              .get('/card/admin/get-saved-cards-with-user-id/' + userIdList[0])
              .set('Authorization', 'Bearer ' + adminToken)
              .expect(200);
          });
        });
      });
    });

    describe('GET getSavedCardsWithProfileId /admin/get-saved-cards-with-profile-id/:profileId', () => {
      describe('when user is not connected', () => {
        it('should return 401', async () => {
          await request(app.getHttpServer())
            .get('/card/admin/get-saved-cards-with-profile-id/' + profileIdList[0])
            .expect(401);
        });
      });

      describe('when user is connected as PUBLIC', () => {
        describe('when profileId is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .get('/card/admin/get-saved-cards-with-profile-id/' + 'not-valid-id')
              .set('Authorization', 'Bearer ' + publicToken)
              .expect(400);
          });
        });

        describe('when profileId is valid', () => {
          describe('when profileId is not from the user', () => {
            it('should return 403', async () => {
              await request(app.getHttpServer())
                .get('/card/admin/get-saved-cards-with-profile-id/' + profileIdList[0])
                .set('Authorization', 'Bearer ' + publicToken)
                .expect(403);
            });
          });

          describe('when profileId is from the user', () => {
            describe('when there is no saved card', () => {
              it('should return 200', async () => {
                await request(app.getHttpServer())
                  .get('/card/admin/get-saved-cards-with-profile-id/' + profileIdList[1])
                  .set('Authorization', 'Bearer ' + publicToken)
                  .expect(200);
              });
            });

            describe('when there is saved card', () => {
              it('should return 200', async () => {
                await request(app.getHttpServer())
                  .get('/card/admin/get-saved-cards-with-profile-id/' + profileIdList[0])
                  .set('Authorization', 'Bearer ' + publicToken)
                  .expect(200);
              });
            });
          });
        });
      });
    });

    describe('PUT addSavedCardToMyCard /card/public/add-saved-card-to-my-card', () => {
      describe('when user is not connected', () => {
        it('should return 401', async () => {
          await request(app.getHttpServer())
            .put('/card/public/add-saved-card-to-my-card')
            .send({
              cardId: cardIdList[0],
              profileId: profileIdList[0],
            })
            .expect(401);
        });
      });

      describe('when user is connected as PUBLIC', () => {
        describe('when cardId is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .put('/card/public/add-saved-card-to-my-card')
              .set('Authorization', 'Bearer ' + publicToken)
              .send({
                cardId: 'not-valid-id',
                profileId: profileIdList[0],
              })
              .expect(400)
              .then(response => {
                expect(response.body.message).toEqual('cardId is not valid');
              });
          });
        });
        describe('when profileId is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .put('/card/public/add-saved-card-to-my-card')
              .set('Authorization', 'Bearer ' + publicToken)
              .send({
                cardId: cardIdList[0],
                profileId: 'not-valid-id',
              })
              .expect(400)
              .then(response => {
                expect(response.body.message).toEqual('profileId is not valid');
              });
          });
        });

        describe('when cardId and profileId are valid', () => {
          describe('when profileId is not from the user', () => {
            it('should return 403', async () => {
              await request(app.getHttpServer())
                .put('/card/public/add-saved-card-to-my-card')
                .set('Authorization', 'Bearer ' + publicToken)
                .send({
                  cardId: cardIdList[0],
                  profileId: profileIdList[4],
                })
                .expect(403)
                .then(response => {
                  expect(response.body.message).toEqual('profileId is not from the user');
                });
            });
          });

          describe('when saved card is already in my card', () => {
            it('should return 400', async () => {
              await request(app.getHttpServer())
                .put('/card/public/add-saved-card-to-my-card')
                .set('Authorization', 'Bearer ' + publicToken)
                .send({
                  cardId: cardIdList[0],
                  profileId: profileIdList[0],
                })
                .expect(400)
                .then(response => {
                  expect(response.body.message).toEqual('saved card is already in my card');
                });
            });
          });

          describe('when should work properly', () => {
            it('should return 200', async () => {
              await request(app.getHttpServer())
                .put('/card/public/add-saved-card-to-my-card')
                .set('Authorization', 'Bearer ' + publicToken)
                .send({
                  cardId: cardIdList[1],
                  profileId: profileIdList[1],
                })
                .expect(200);
              await request(app.getHttpServer())
                .get('/api/test/get-card-with-id-test/' + cardIdList[1])
                .expect(201)
                .then(response => {
                  expect(response.body.connectedCardList).toContainEqual(cardIdList[0]);
                });
            });
          });
        });
      });
    });

    describe('PUT removeSavedCardFromMyCard /card/public/remove-saved-card-from-my-card', () => {
      describe('when user is not connected', () => {
        it('should return 401', async () => {
          await request(app.getHttpServer())
            .put('/card/public/remove-saved-card-from-my-card')
            .send({
              cardId: cardIdList[0],
              profileId: profileIdList[0],
            })
            .expect(401);
        });
      });

      describe('when user is connected as PUBLIC', () => {
        describe('when cardId is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .put('/card/public/remove-saved-card-from-my-card')
              .set('Authorization', 'Bearer ' + publicToken)
              .send({
                cardId: 'not-valid-id',
                profileId: profileIdList[0],
              })
              .expect(400)
              .then(response => {
                expect(response.body.message).toEqual('cardId is not valid');
              });
          });
        });

        describe('when profileId is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .put('/card/public/remove-saved-card-from-my-card')
              .set('Authorization', 'Bearer ' + publicToken)
              .send({
                cardId: cardIdList[0],
                profileId: 'not-valid-id',
              })
              .expect(400)
              .then(response => {
                expect(response.body.message).toEqual('profileId is not valid');
              });
          });
        });

        describe('when cardId and profileId are valid', () => {
          describe('when cardId is from the user', () => {
            it('should return 400', () => {
              return request(app.getHttpServer())
                .put('/card/public/remove-saved-card-from-my-card')
                .set('Authorization', 'Bearer ' + publicToken)
                .send({
                  cardId: cardIdList[0],
                  profileId: profileIdList[0],
                })
                .expect(400)
                .then(response => {
                  expect(response.body.message).toEqual('cardId is from the user');
                });
            });
          });

          describe('when profileId is not from the user', () => {
            it('should return 403', () => {
              return request(app.getHttpServer())
                .put('/card/public/remove-saved-card-from-my-card')
                .set('Authorization', 'Bearer ' + publicToken)
                .send({
                  cardId: cardIdList[1],
                  profileId: profileIdList[4],
                })
                .expect(403)
                .then(response => {
                  expect(response.body.message).toEqual('profileId is not from the user');
                });
            });
          });

          describe('when saved card is not in my card', () => {
            it('should return 400', () => {
              return request(app.getHttpServer())
                .put('/card/public/remove-saved-card-from-my-card')
                .set('Authorization', 'Bearer ' + publicToken)
                .send({
                  cardId: cardIdList[1],
                  profileId: profileIdList[1],
                })
                .expect(400)
                .then(response => {
                  expect(response.body.message).toEqual('saved card is not in my card');
                });
            });
          });

          describe('when should work properly', () => {
            it('should return 200', async () => {
              await request(app.getHttpServer())
                .put('/card/public/remove-saved-card-from-my-card')
                .set('Authorization', 'Bearer ' + publicToken)
                .send({
                  cardId: cardIdList[1],
                  profileId: profileIdList[1],
                })
                .expect(200);
              await request(app.getHttpServer())
                .get('/api/test/get-card-with-id-test/' + cardIdList[1])
                .expect(201)
                .then(response => {
                  expect(response.body.connectedCardList).not.toContainEqual(cardIdList[0]);
                });
            });
          });
        });
      });
    });
  });

  describe('ConnectedCard Test', () => {
    const connectCardIdList = [];

    beforeEach(async () => {
      async function createConnectedCard(cardId: string, connectedCardId: string): Promise<supertest.Test> {
        return request(app.getHttpServer())
          .post('/api/test/add-connected-card-test')
          .send({
            cardId: cardId,
            connectedCardId: connectedCardId,
          })
          .expect(201)
          .then(response => {
            connectCardIdList.push(response.body.id);
            return response;
          });
      }

      async function removeConnectedCard(id: string, id2: string): Promise<supertest.Test> {
        return request(app.getHttpServer())
          .put('/api/test/remove-connected-card-test')
          .send({
            id: id,
            id2: id2,
          })
          .expect(200);
      }

      await createConnectedCard(cardIdList[0], cardIdList[12]);
      await createConnectedCard(cardIdList[3], cardIdList[12]);
      await createConnectedCard(cardIdList[7], cardIdList[12]);
      await removeConnectedCard(cardIdList[7], cardIdList[12]);

      // await createConnectedCard(cardIdList[0], cardIdList[16]);
      // await createConnectedCard(cardIdList[3], cardIdList[16]);
      // await createConnectedCard(cardIdList[7], cardIdList[16]);
      // await removeConnectedCard(cardIdList[7], cardIdList[16]);

      await createConnectedCard(cardIdList[0], cardIdList[20]);
      await createConnectedCard(cardIdList[3], cardIdList[20]);
      await createConnectedCard(cardIdList[7], cardIdList[20]);
      await removeConnectedCard(cardIdList[7], cardIdList[20]);
    });

    describe('PUT addConnectedCard /card/public/add-connected-card', () => {
      describe('when user is not connected', () => {
        it('should return 401', async () => {
          await request(app.getHttpServer())
            .put('/card/public/add-connected-card')
            .send({
              cardId: cardIdList[0],
              connectedCardId: cardIdList[12],
            })
            .expect(401);
        });
      });
      describe('when user is connected as PUBLIC', () => {
        describe('when cardId is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .put('/card/public/add-connected-card')
              .set('Authorization', 'Bearer ' + publicToken)
              .send({
                cardId: 'not-valid-id',
                connectedCardId: cardIdList[12],
              })
              .expect(400);
          });
        });

        describe('when connectedCardId is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .put('/card/public/add-connected-card')
              .set('Authorization', 'Bearer ' + publicToken)
              .send({
                cardId: cardIdList[0],
                connectedCardId: 'not-valid-id',
              })
              .expect(400);
          });
        });

        describe('when both card ID are valid', () => {
          describe('when cardId is not from the user', () => {
            it('should return 403', async () => {
              await request(app.getHttpServer())
                .put('/card/public/add-connected-card')
                .set('Authorization', 'Bearer ' + publicToken)
                .send({
                  cardId: cardIdList[0],
                  connectedCardId: cardIdList[12],
                })
                .expect(403);
            });
          });
          describe('when cardId is from the user', () => {
            describe('when cardId and connectedCardId are the same', () => {
              it('should return 400', async () => {
                await request(app.getHttpServer())
                  .put('/card/public/add-connected-card')
                  .set('Authorization', 'Bearer ' + publicToken)
                  .send({
                    cardId: cardIdList[0],
                    connectedCardId: cardIdList[0],
                  })
                  .expect(400);
              });
            });
            describe('when cardId and connectedCardId are not the same', () => {
              describe('when cardId and connectedCardId are already connected', () => {
                it('should return 403', async () => {
                  await request(app.getHttpServer())
                    .put('/card/public/add-connected-card')
                    .set('Authorization', 'Bearer ' + publicToken)
                    .send({
                      cardId: cardIdList[0],
                      connectedCardId: cardIdList[12],
                    })
                    .expect(403);
                });
              });

              describe('when cardId and connectedCardId are not already connected', () => {
                it('should return 201', async () => {
                  await request(app.getHttpServer())
                    .put('/card/public/add-connected-card')
                    .set('Authorization', 'Bearer ' + publicToken)
                    .send({
                      cardId: cardIdList[0],
                      connectedCardId: cardIdList[16],
                    })
                    .expect(201);
                  await request(app.getHttpServer())
                    .get('/api/test/get-card-test/' + cardIdList[0])
                    .expect(200)
                    .expect(res => {
                      expect(res.body.connectedCardList.length).toBe(3);
                    });
                });
              });

              describe('when connectedCardId come from the same profile as cardId', () => {
                it('should return 400', async () => {
                  await request(app.getHttpServer())
                    .put('/card/public/add-connected-card')
                    .set('Authorization', 'Bearer ' + publicToken)
                    .send({
                      cardId: cardIdList[0],
                      connectedCardId: cardIdList[3],
                    })
                    .expect(400);
                });
              });
            });
          });
        });
      });
    });

    describe('PUT removeConnectedCard /card/public/remove-connected-card', () => {
      describe('when user is not connected', () => {
        it('should return 401', async () => {
          await request(app.getHttpServer())
            .put('/card/public/remove-connected-card')
            .send({
              cardId: cardIdList[0],
              connectedCardId: cardIdList[12],
            })
            .expect(401);
        });
      });

      describe('when user is connected as PUBLIC', () => {
        describe('when cardId is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .put('/card/public/remove-connected-card')
              .set('Authorization', 'Bearer ' + publicToken)
              .send({
                cardId: 'not-valid-id',
                connectedCardId: cardIdList[12],
              })
              .expect(400);
          });
        });

        describe('when connectedCardId is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .put('/card/public/remove-connected-card')
              .set('Authorization', 'Bearer ' + publicToken)
              .send({
                cardId: cardIdList[0],
                connectedCardId: 'not-valid-id',
              })
              .expect(400);
          });
        });

        describe('when both card ID are valid', () => {
          describe('when cardId is not from the user', () => {
            it('should return 403', async () => {
              await request(app.getHttpServer())
                .put('/card/public/remove-connected-card')
                .set('Authorization', 'Bearer ' + publicToken)
                .send({
                  cardId: cardIdList[0],
                  connectedCardId: cardIdList[12],
                })
                .expect(403);
            });
          });
          describe('when cardId is from the user', () => {
            describe('when cardId and connectedCardId are the same', () => {
              it('should return 400', async () => {
                await request(app.getHttpServer())
                  .put('/card/public/remove-connected-card')
                  .set('Authorization', 'Bearer ' + publicToken)
                  .send({
                    cardId: cardIdList[0],
                    connectedCardId: cardIdList[0],
                  })
                  .expect(400);
              });
            });

            describe('when cardId and connectedCardId are not the same', () => {
              describe('when cardId and connectedCardId are not connected', () => {
                it('should return 400', async () => {
                  await request(app.getHttpServer())
                    .put('/card/public/remove-connected-card')
                    .set('Authorization', 'Bearer ' + publicToken)
                    .send({
                      cardId: cardIdList[0],
                      connectedCardId: cardIdList[16],
                    })
                    .expect(400);
                });
              });

              describe('when cardId and connectedCardId are connected', () => {
                it('should return 201', async () => {
                  await request(app.getHttpServer())
                    .put('/card/public/remove-connected-card')
                    .set('Authorization', 'Bearer ' + publicToken)
                    .send({
                      cardId: cardIdList[0],
                      connectedCardId: cardIdList[12],
                    })
                    .expect(201);
                  await request(app.getHttpServer())
                    .get('/api/test/get-card-test/' + cardIdList[0])
                    .expect(200)
                    .expect(res => {
                      expect(res.body.connectedCardList.length).toBe(1);
                    });
                });
              });
            });
          });
        });
      });
    });
    describe('PUT /card/admin/add-connected-card', () => {
      describe('when user is not connected', () => {
        it('should return 401', async () => {
          await request(app.getHttpServer())
            .put('/card/admin/add-connected-card')
            .send({
              cardId: cardIdList[0],
              connectedCardId: cardIdList[12],
            })
            .expect(401);
        });
      });
      describe('when user is connected as PUBLIC', () => {
        it('should return 403', async () => {
          await request(app.getHttpServer())
            .put('/card/admin/add-connected-card')
            .set('Authorization', 'Bearer ' + publicToken)
            .send({
              cardId: cardIdList[0],
              connectedCardId: cardIdList[12],
            })
            .expect(403);
        });
      });
      describe('when user is connected as ADMIN', () => {
        describe('when cardId is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .put('/card/admin/add-connected-card')
              .set('Authorization', 'Bearer ' + adminToken)
              .send({
                cardId: 'not-valid-id',
                connectedCardId: cardIdList[12],
              })
              .expect(400);
          });
        });
        describe('when connectedCardId is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .put('/card/admin/add-connected-card')
              .set('Authorization', 'Bearer ' + adminToken)
              .send({
                cardId: cardIdList[0],
                connectedCardId: 'not-valid-id',
              })
              .expect(400);
          });
        });
        describe('when both card ID are valid', () => {
          describe('when card are already connected', () => {
            it('should return 400', async () => {
              await request(app.getHttpServer())
                .put('/card/admin/add-connected-card')
                .set('Authorization', 'Bearer ' + adminToken)
                .send({
                  cardId: cardIdList[0],
                  connectedCardId: cardIdList[12],
                })
                .expect(400);
            });
          });

          describe('when card are not connected', () => {
            it('should return 201', async () => {
              await request(app.getHttpServer())
                .put('/card/admin/add-connected-card')
                .set('Authorization', 'Bearer ' + adminToken)
                .send({
                  cardId: cardIdList[0],
                  connectedCardId: cardIdList[16],
                })
                .expect(201);
              await request(app.getHttpServer())
                .get('/api/test/get-card-test/' + cardIdList[0])
                .expect(200)
                .expect(res => {
                  expect(res.body.connectedCardList.length).toBe(3);
                });
            });
          });
        });
      });
    });
    describe('PUT /card/admin/remove-connected-card', () => {
      describe('when user is not connected', () => {
        it('should return 401', async () => {
          await request(app.getHttpServer())
            .put('/card/admin/remove-connected-card')
            .send({
              cardId: cardIdList[0],
              connectedCardId: cardIdList[12],
            })
            .expect(401);
        });
      });
      describe('when user is connected as PUBLIC', () => {
        it('should return 403', async () => {
          await request(app.getHttpServer())
            .put('/card/admin/remove-connected-card')
            .set('Authorization', 'Bearer ' + publicToken)
            .send({
              cardId: cardIdList[0],
              connectedCardId: cardIdList[12],
            })
            .expect(403);
        });
      });
      describe('when user is connected as ADMIN', () => {
        describe('when cardId is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .put('/card/admin/remove-connected-card')
              .set('Authorization', 'Bearer ' + adminToken)
              .send({
                cardId: 'not-valid-id',
                connectedCardId: cardIdList[12],
              })
              .expect(400);
          });
        });
        describe('when connectedCardId is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .put('/card/admin/remove-connected-card')
              .set('Authorization', 'Bearer ' + adminToken)
              .send({
                cardId: cardIdList[0],
                connectedCardId: 'not-valid-id',
              })
              .expect(400);
          });
        });
        describe('when both card ID are valid', () => {
          describe('when card are not connected', () => {
            it('should return 400', async () => {
              await request(app.getHttpServer())
                .put('/card/admin/remove-connected-card')
                .set('Authorization', 'Bearer ' + adminToken)
                .send({
                  cardId: cardIdList[0],
                  connectedCardId: cardIdList[16],
                })
                .expect(400);
            });
          });

          describe('when card are connected', () => {
            it('should return 201', async () => {
              await request(app.getHttpServer())
                .put('/card/admin/remove-connected-card')
                .set('Authorization', 'Bearer ' + adminToken)
                .send({
                  cardId: cardIdList[0],
                  connectedCardId: cardIdList[12],
                })
                .expect(201);
              await request(app.getHttpServer())
                .get('/api/test/get-card-test/' + cardIdList[0])
                .expect(200)
                .expect(res => {
                  expect(res.body.connectedCardList.length).toBe(2);
                });
            });
          });
        });
      });
    });
  });

  describe('PUT /card/open/add-view-count/:cardId', () => {
    describe('when user is not connected', () => {
      describe('when cardId is not valid', () => {
        it('should return 400', async () => {
          await request(app.getHttpServer()).put('/card/open/add-view-count/not-valid-id').expect(400);
        });
      });
      describe('when cardId is valid', () => {
        it('should return 201 and count card should be +1', async () => {
          await request(app.getHttpServer())
            .put('/card/open/add-view-count/' + cardIdList[0])
            .expect(204);
          await request(app.getHttpServer())
            .get('/api/test/get-card-test/' + cardIdList[0])
            .expect(200)
            .expect(res => {
              expect(res.body.viewCount).toBe(1);
            });
        });
      });
    });
  });

  describe('POST createCard /card/admin/create-card/:profileId', () => {
    describe('when user is not connected', () => {
      it('should return 401', async () => {
        await request(app.getHttpServer())
          .post('/card/admin/create-card/' + profileIdList[0])
          .expect(401)
          .then(response => {
            expect(response.body.message).toEqual('Unauthorized');
          });
      });
    });
    describe('when user is connected as PUBLIC', () => {
      it('should return 403', async () => {
        await request(app.getHttpServer())
          .post('/card/admin/create-card/' + profileIdList[0])
          .set('Authorization', 'Bearer ' + publicToken)
          .send({
            socialNetworkName: 'facebook',
            socialName: 'bob',
            typeOfCardEnum: TypeOfCardEnum.SOCIAL_NETWORK,
          })
          .expect(403)
          .then(response => {
            expect(response.body.message).toEqual('Forbidden resource');
          });
      });
    });

    describe('when user is connected as ADMIN', () => {
      describe('when profileId is not valid', () => {
        it('should return 400', async () => {
          await request(app.getHttpServer())
            .post('/card/admin/create-card/not-valid-id')
            .set('Authorization', 'Bearer ' + adminToken)
            .send({
              socialNetworkName: 'facebook',
              socialName: 'bob',
              typeOfCardEnum: TypeOfCardEnum.SOCIAL_NETWORK,
            })
            .expect(400)
            .then(response => {
              expect(response.body.message).toEqual('Bad Request');
            });
        });
      });
      describe('when want to create social network Card', () => {
        it('should return 200 and new card', async () => {
          await request(app.getHttpServer())
            .post('/card/admin/create-card/' + profileIdList[0])
            .set('Authorization', 'Bearer ' + adminToken)
            .send({
              socialNetworkName: 'facebook',
              socialName: 'bob',
              typeOfCardEnum: TypeOfCardEnum.SOCIAL_NETWORK,
            })
            .expect(201);
          await request(app.getHttpServer())
            .get('/api/test/get-all-card-test')
            .expect(200)
            .then(response => {
              expect(response.body.length).toEqual(5);
              expect(response.body[response.body.length - 1].socialName).toEqual('bob');
              expect(response.body[response.body.length - 1].socialNetworkName).toEqual('facebook');
              expect(response.body[response.body.length - 1].typeOfCardEnum).toEqual(TypeOfCardEnum.SOCIAL_NETWORK);
            });
        });
      });

      describe('when want to create siteWeb Card', () => {
        describe('when everithing should work properly', () => {
          it('should return 200 and new card', async () => {
            await request(app.getHttpServer())
              .post('/card/admin/create-card/' + profileIdList[0])
              .set('Authorization', 'Bearer ' + adminToken)
              .send({
                firstname: 'site Web de moi',
                urls: ['https://www.ceci-est-une-url.com/billyBob'],
                typeOfCardEnum: TypeOfCardEnum.WEBSITE,
              })
              .expect(201);
          });
        });

        describe('when url is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .post('/card/admin/create-card/' + profileIdList[0])
              .set('Authorization', 'Bearer ' + adminToken)
              .send({
                firstname: 'site Web de moi',
                urls: ['https://www.ceci-est-une-url.com/billyBob', 'ceci nest pas une url'],
                typeOfCardEnum: TypeOfCardEnum.WEBSITE,
              })
              .expect(400)
              .then(response => {
                expect(response.body.message).toEqual('Bad Request');
              });
          });
        });
      });

      describe('when want to create V_Card', () => {
        describe('when everything should work properly', () => {
          it('should return 201', async () => {
            await request(app.getHttpServer())
              .post('/card/admin/create-card/' + profileIdList[0])
              .set('Authorization', 'Bearer ' + adminToken)
              .send({
                firstname: 'bob',
                lastname: 'bob',
                occupationsId: [occupationIdList[0]],
                typeOfCardEnum: TypeOfCardEnum.V_CARD,
              })
              .expect(201)
              .then(response => {
                expect(response.body.firstname).toEqual('bob');
                expect(response.body.lastname).toEqual('bob');
                expect(response.body.occupationsId).toEqual([occupationIdList[0]]);
                expect(response.body.typeOfCardEnum).toEqual(TypeOfCardEnum.V_CARD);
              });
          });
        });
        describe('when occupationId is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .post('/card/admin/create-card/' + profileIdList[0])
              .set('Authorization', 'Bearer ' + adminToken)
              .send({
                firstname: 'bob',
                lastname: 'bob',
                occupationsId: ['not-valid-id'],
                typeOfCardEnum: TypeOfCardEnum.V_CARD,
              })
              .expect(400)
              .then(response => {
                expect(response.body.message).toEqual('Bad Request');
              });
          });
        });
      });
    });
  });

  describe('DELETE deleteCard /card/admin/delete-card/:cardId', () => {
    describe('when user is connected as ADMIN', () => {
      describe('when cardId is not valid', () => {
        it('should return 400', async () => {
          await request(app.getHttpServer())
            .delete('/card/admin/delete-card/not-valid-id')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(400)
            .then(response => {
              expect(response.body.message).toEqual('Bad Request');
            });
        });
      });

      describe('when everything should work properly', () => {
        it('should return 200', async () => {
          await request(app.getHttpServer())
            .delete('/card/admin/delete-card/' + cardIdList[0])
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200)
            .then(response => {
              expect(response.body).toEqual('Card deleted');
            });
          await request(app.getHttpServer())
            .get('/api/test/get-all-card-test')
            .expect(200)
            .then(response => {
              expect(response.body.length).toEqual(4);
            });
        });
      });
    });

    describe('when user is not connected', () => {
      it('should return 401', async () => {
        await request(app.getHttpServer())
          .delete('/card/admin/delete-card/' + cardIdList[0])
          .expect(401)
          .then(response => {
            expect(response.body.message).toEqual('Unauthorized');
          });
      });
    });

    describe('when user is connected as PUBLIC', () => {
      it('should return 403', async () => {
        await request(app.getHttpServer())
          .delete('/card/admin/delete-card/' + cardIdList[0])
          .set('Authorization', 'Bearer ' + publicToken)
          .expect(403)
          .then(response => {
            expect(response.body.message).toEqual('Forbidden resource');
          });
      });
    });
  });

  describe('DELETE deleteMyCard /public/delete-card/:cardId', () => {
    describe('when user is not connected', () => {
      it('should return 401', async () => {
        await request(app.getHttpServer())
          .delete('/public/delete-card/' + cardIdList[0])
          .expect(401)
          .then(response => {
            expect(response.body.message).toEqual('Unauthorized');
          });
      });
    });

    describe('when user is connected as PUBLIC', () => {
      describe('when cardId is not valid', () => {
        it('should return 400', async () => {
          await request(app.getHttpServer())
            .delete('/public/delete-card/not-valid-id')
            .set('Authorization', 'Bearer ' + publicToken)
            .expect(400)
            .then(response => {
              expect(response.body.message).toEqual('Bad Request');
            });
        });
      });

      describe('when user is not the owner of the card', () => {
        it('should return 403', async () => {
          await request(app.getHttpServer())
            .delete('/public/delete-card/' + cardIdList[0])
            .set('Authorization', 'Bearer ' + public2Token)
            .expect(403)
            .then(response => {
              expect(response.body.message).toEqual('Forbidden resource');
            });
        });
      });

      describe('when everything should work properly', () => {
        it('should return 204', async () => {
          await request(app.getHttpServer())
            .delete('/public/delete-card/' + cardIdList[0])
            .set('Authorization', 'Bearer ' + publicToken)
            .expect(204);

          await request(app.getHttpServer())
            .get('/api/test/get-all-card-test')
            .expect(200)
            .then(response => {
              response.body.forEach((card: CardEntity) => {
                if (card.id === cardIdList[0]) {
                  expect(card.deletedAt).not.toBeNull();
                }
              });
            });
        });
      });
    });
  });

  describe('DELETE softDeleteCard /card/admin/soft-delete-card/:cardId', () => {
    describe('when user is not connected', () => {
      it('should return 401', async () => {
        await request(app.getHttpServer())
          .delete('/card/admin/soft-delete-card/' + cardIdList[0])
          .expect(401)
          .then(response => {
            expect(response.body.message).toEqual('Unauthorized');
          });
      });
    });

    describe('when user is connected as PUBLIC', () => {
      it('should return 403', async () => {
        await request(app.getHttpServer())
          .delete('/card/admin/soft-delete-card/' + cardIdList[0])
          .set('Authorization', 'Bearer ' + publicToken)
          .expect(403)
          .then(response => {
            expect(response.body.message).toEqual('Forbidden resource');
          });
      });
    });

    describe('when user is connected as ADMIN', () => {
      describe('when cardId is not valid', () => {
        it('should return 400', async () => {
          await request(app.getHttpServer())
            .delete('/card/admin/soft-delete-card/not-valid-id')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(400)
            .then(response => {
              expect(response.body.message).toEqual('Bad Request');
            });
        });
      });

      describe('when card is already soft-deleted', () => {
        it('should return 400', async () => {
          await request(app.getHttpServer())
            .delete('/card/admin/soft-delete-card/' + cardIdList[0])
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(400)
            .then(response => {
              expect(response.body.message).toEqual('Bad Request');
            });
        });
      });

      describe('when everything should work properly', () => {
        it('should return 200', async () => {
          await request(app.getHttpServer())
            .delete('/card/admin/soft-delete-card/' + cardIdList[0])
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(200)
            .then(response => {
              expect(response.body).toEqual('Card deleted');
            });
          await request(app.getHttpServer())
            .get('/api/test/get-all-card-test')
            .expect(200)
            .then(response => {
              expect(response.body.length).toEqual(4);
            });
        });
      });
    });
  });

  describe('PUT restoreCard /card/admin/restore-card/:cardId', () => {
    describe('when user is not connected', () => {
      it('should return 401', async () => {
        await request(app.getHttpServer())
          .put('/card/admin/restore-card/' + cardIdList[0])
          .expect(401)
          .then(response => {
            expect(response.body.message).toEqual('Unauthorized');
          });
      });
    });

    describe('when user is connected as PUBLIC', () => {
      it('should return 403', async () => {
        await request(app.getHttpServer())
          .put('/card/admin/restore-card/' + cardIdList[0])
          .set('Authorization', 'Bearer ' + publicToken)
          .expect(403)
          .then(response => {
            expect(response.body.message).toEqual('Forbidden resource');
          });
      });
    });

    describe('when user is connected as ADMIN', () => {
      describe('when cardId is not valid', () => {
        it('should return 400', async () => {
          await request(app.getHttpServer())
            .put('/card/admin/restore-card/not-valid-id')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(400)
            .then(response => {
              expect(response.body.message).toEqual('Bad Request');
            });
        });
      });

      describe('when card is not soft-deleted', () => {
        it('should return 400', async () => {
          await request(app.getHttpServer())
            .put('/card/admin/restore-card/' + cardIdList[0])
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(400)
            .then(response => {
              expect(response.body.message).toEqual('Bad Request');
            });
        });
      });

      describe('when everything should work properly', () => {
        it('should return 200', async () => {
          await request(app.getHttpServer())
            .put('/card/admin/restore-card/' + cardIdList[11])
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(204);
          await request(app.getHttpServer())
            .get('/api/test/get-card-test/' + cardIdList[11])
            .expect(200)
            .then(response => {
              expect(response.body.deletedAt).toBeNull();
            });
        });
      });
    });
  });

  describe('PUT updateCard /card/admin/update-card/:cardId', () => {
    describe('when user is not connected', () => {
      it('should return 401', async () => {
        await request(app.getHttpServer())
          .put('/card/admin/update-card/' + cardIdList[0])
          .expect(401)
          .then(response => {
            expect(response.body.message).toEqual('Unauthorized');
          });
      });
    });

    describe('when user is connected as PUBLIC', () => {
      it('should return 403', async () => {
        await request(app.getHttpServer())
          .put('/card/admin/update-card/' + cardIdList[0])
          .set('Authorization', 'Bearer ' + publicToken)
          .expect(403)
          .then(response => {
            expect(response.body.message).toEqual('Forbidden resource');
          });
      });
    });

    describe('when user is connected as ADMIN', () => {
      describe('when cardId is not valid', () => {
        it('should return 400', async () => {
          await request(app.getHttpServer())
            .put('/card/admin/update-card/not-valid-id')
            .set('Authorization', 'Bearer ' + adminToken)
            .expect(400)
            .then(response => {
              expect(response.body.message).toEqual('Bad Request');
            });
        });
      });

      describe('when card ID is valid', () => {
        describe('when card is soft-deleted', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .put('/card/admin/update-card/' + cardIdList[11])
              .set('Authorization', 'Bearer ' + adminToken)
              .send({
                typeOfCard: TypeOfCardEnum.WALLET_SHARE,
              })
              .expect(400)
              .then(response => {
                expect(response.body.message).toEqual('Bad Request');
              });
          });
        });
      });

      describe('when want to add occupation', () => {
        describe('when occupation is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .put('/card/admin/update-card/' + cardIdList[0])
              .set('Authorization', 'Bearer ' + adminToken)
              .send({
                typeOfCard: TypeOfCardEnum.V_CARD,
                occupation: 'not valid occupation',
              })
              .expect(400)
              .then(response => {
                expect(response.body.message).toEqual('Bad Request');
              });
          });
        });

        describe('when want to remove occupation', () => {
          it('should return 200', async () => {
            await request(app.getHttpServer())
              .put('/card/admin/update-card/' + cardIdList[0])
              .set('Authorization', 'Bearer ' + adminToken)
              .send({
                typeOfCard: TypeOfCardEnum.V_CARD,
                occupation: [],
              })
              .expect(200);

            await request(app.getHttpServer())
              .get('/api/test/get-card-test/' + cardIdList[0])
              .expect(200)
              .then(response => {
                expect(response.body.occupation).toEqual([]);
              });
          });
        });
      });

      describe('when want to update WhoCanShareCardEnum', () => {
        describe('when WhoCanShareCardEnum is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .put('/card/admin/update-card/' + cardIdList[0])
              .set('Authorization', 'Bearer ' + adminToken)
              .send({
                typeOfCard: TypeOfCardEnum.V_CARD,
                whoCanShareCard: 'not valid WhoCanShareCardEnum',
              })
              .expect(400)
              .then(response => {
                expect(response.body.message).toEqual('Bad Request');
              });
          });
        });

        describe('when want to update WhoCanShareCardEnum', () => {
          it('should return 200', async () => {
            await request(app.getHttpServer())
              .put('/card/admin/update-card/' + cardIdList[0])
              .set('Authorization', 'Bearer ' + adminToken)
              .send({
                typeOfCard: TypeOfCardEnum.V_CARD,
                whoCanShareCard: WhoCanShareCardEnum.NOT_DIFFUSIBLE,
              })
              .expect(200);

            await request(app.getHttpServer())
              .get('/api/test/get-card-test/' + cardIdList[0])
              .expect(200)
              .then(response => {
                expect(response.body.whoCanShareCard).toEqual(WhoCanShareCardEnum.NOT_DIFFUSIBLE);
              });
          });
        });
      });

      describe('when want to update WhoCanCommunicateWithEnum', () => {
        describe('when WhoCanCommunicateWithEnum is not valid', () => {
          it('should return 400', async () => {
            await request(app.getHttpServer())
              .put('/card/admin/update-card/' + cardIdList[0])
              .set('Authorization', 'Bearer ' + adminToken)
              .send({
                typeOfCard: TypeOfCardEnum.V_CARD,
                whoCanCommunicateWith: 'not valid WhoCanCommunicateWithEnum',
              })
              .expect(400)
              .then(response => {
                expect(response.body.message).toEqual('Bad Request');
              });
          });
        });

        describe('when should be valid', () => {
          it('should return 200', async () => {
            await request(app.getHttpServer())
              .put('/card/admin/update-card/' + cardIdList[0])
              .set('Authorization', 'Bearer ' + adminToken)
              .send({
                typeOfCard: TypeOfCardEnum.V_CARD,
                whoCanCommunicateWith: WhoCanCommunicateWithEnum.NOBODY,
              })
              .expect(200);

            await request(app.getHttpServer())
              .get('/api/test/get-card-test/' + cardIdList[0])
              .expect(200)
              .then(response => {
                expect(response.body.whoCanCommunicateWith).toEqual(WhoCanCommunicateWithEnum.NOBODY);
              });
          });
        });
      });
    });
  });

  describe('PUT updateMyCard /card/public/update-my-card/:cardId', () => {
    describe('when user is not logged', () => {
      it('should return 401', async () => {
        await request(app.getHttpServer())
          .put('/card/public/update-my-card/' + cardIdList[0])
          .expect(401)
          .then(response => {
            expect(response.body.message).toEqual('Unauthorized');
          });
      });
    });

    describe('when user is connected as PUBLIC', () => {
      describe('when cardId is not valid', () => {
        it('should return 400', async () => {
          await request(app.getHttpServer())
            .put('/card/public/update-my-card/' + 'not valid cardId')
            .set('Authorization', 'Bearer ' + publicToken)
            .send({
              typeOfCard: TypeOfCardEnum.V_CARD,
              firstName: 'new firstName',
            })
            .expect(400)
            .then(response => {
              expect(response.body.message).toEqual('Bad Request');
            });
        });
      });

      // do the same thing as admin 'PUT updateCard /card/admin/update-card/:cardId'
      describe('when card id is valid', () => {
        describe('when want to update occupation', () => {
          describe('when occupation is not valid', () => {
            it('should return 400', async () => {
              await request(app.getHttpServer())
                .put('/card/public/update-my-card/' + cardIdList[0])
                .set('Authorization', 'Bearer ' + publicToken)
                .send({
                  typeOfCard: TypeOfCardEnum.V_CARD,
                  occupation: 'not valid occupation',
                })
                .expect(400)
                .then(response => {
                  expect(response.body.message).toEqual('Bad Request');
                });
            });
          });
          describe('when occupation is valid', () => {
            it('should return 200', async () => {
              await request(app.getHttpServer())
                .put('/card/public/update-my-card/' + cardIdList[0])
                .set('Authorization', 'Bearer ' + publicToken)
                .send({
                  typeOfCard: TypeOfCardEnum.V_CARD,
                  occupation: ['new occupation'],
                })
                .expect(200);

              await request(app.getHttpServer())
                .get('/api/test/get-card-test/' + cardIdList[0])
                .expect(200)
                .then(response => {
                  expect(response.body.occupation).toEqual(['new occupation']);
                });
            });
          });
        });
        describe('when card is not from profile of user', () => {
          it('should return 403', async () => {
            await request(app.getHttpServer())
              .put('/card/public/update-my-card/' + cardIdList[1])
              .set('Authorization', 'Bearer ' + publicToken)
              .send({
                typeOfCard: TypeOfCardEnum.V_CARD,
                firstName: 'new firstName',
              })
              .expect(403)
              .then(response => {
                expect(response.body.message).toEqual('Forbidden');
              });
          });
        });

        describe('when want to upate whoCanShareCardEnum', () => {
          describe('when whoCanShareCardEnum is not valid', () => {
            it('should return 400', async () => {
              await request(app.getHttpServer())
                .put('/card/public/update-my-card/' + cardIdList[0])
                .set('Authorization', 'Bearer ' + publicToken)
                .send({
                  typeOfCard: TypeOfCardEnum.V_CARD,
                  whoCanShareCard: 'not valid WhoCanShareCardEnum',
                })
                .expect(400)
                .then(response => {
                  expect(response.body.message).toEqual('Bad Request');
                });
            });
          });

          describe('when whoCanShareCardEnum is valid', () => {
            it('should return 200', async () => {
              await request(app.getHttpServer())
                .put('/card/public/update-my-card/' + cardIdList[0])
                .set('Authorization', 'Bearer ' + publicToken)
                .send({
                  typeOfCard: TypeOfCardEnum.V_CARD,
                  whoCanShareCard: WhoCanShareCardEnum.ONLY_BY_COMPANY_ADMIN,
                })
                .expect(200);

              await request(app.getHttpServer())
                .get('/api/test/get-card-test/' + cardIdList[0])
                .expect(200)
                .then(response => {
                  expect(response.body.whoCanShareCard).toEqual(WhoCanShareCardEnum.ONLY_BY_COMPANY_ADMIN);
                });
            });
          });
        });

        describe('when want to update whoCanCommunicateWithEnum', () => {
          describe('when whoCanCommunicateWithEnum is not valid', () => {
            it('should return 400', async () => {
              await request(app.getHttpServer())
                .put('/card/public/update-my-card/' + cardIdList[0])
                .set('Authorization', 'Bearer ' + publicToken)
                .send({
                  whoCanCommunicateWith: 'not valid WhoCanCommunicateWithEnum',
                })
                .expect(400)
                .then(response => {
                  expect(response.body.message).toEqual('Bad Request');
                });
            });
          });

          describe('when whoCanCommunicateWithEnum is valid', () => {
            it('should return 200', async () => {
              await request(app.getHttpServer())
                .put('/card/public/update-my-card/' + cardIdList[0])
                .set('Authorization', 'Bearer ' + publicToken)
                .send({
                  whoCanCommunicateWith: WhoCanCommunicateWithEnum.NOBODY,
                })
                .expect(200);

              await request(app.getHttpServer())
                .get('/api/test/get-card-test/' + cardIdList[0])
                .expect(200)
                .then(response => {
                  expect(response.body.whoCanCommunicateWith).toEqual(WhoCanCommunicateWithEnum.NOBODY);
                });
            });
          });
        });
      });
    });
  });
});

/* create Card Test
 User: userPublic1 :
  - Profile: profile1Test1
    - Card: card1Test1WalletShare
      - TypeOfCardEnum.WALLET_SHARE
    - Card: card1Test1Vcard
      - TypeOfCardEnum.V_CARD
    - Card: card2Test1Website
      - TypeOfCardEnum.WEBSITE.
    - Card: card3Test1SocialNetwork
      - TypeOfCardEnum.SOCIAL_NETWORK
  - Profile profile2Test1
    - Card: card1Test2WalletShare
      - TypeOfCardEnum.WALLET_SHARE
    - Card: card1Test2Vcard
      - TypeOfCardEnum.V_CARD
    - Card: card2Test2Website
      - TypeOfCardEnum.WEBSITE.
    - Card: card3Test2SocialNetwork
      - TypeOfCardEnum.SOCIAL_NETWORK
  - Profile profile3Test1 softDeleted
    - Card: card1Test3WalletShare softDeleted
      - TypeOfCardEnum.WALLET_SHARE
    - Card: card1Test3Vcard softDeleted
      - TypeOfCardEnum.V_CARD
    - Card: card2Test3Website softDeleted
      - TypeOfCardEnum.WEBSITE.
    - Card: card3Test3SocialNetwork softDeleted
      - TypeOfCardEnum.SOCIAL_NETWORK

User: userPublic2 :
  - Profile: profile1Test2
    - Card: card1Test3WalletShare
      - TypeOfCardEnum.WALLET_SHARE
    - Card: card1Test3Vcard
      - TypeOfCardEnum.V_CARD
    - Card: card2Test3Website
      - TypeOfCardEnum.WEBSITE.
    - Card: card3Test3SocialNetwork
      - TypeOfCardEnum.SOCIAL_NETWORK
  - Profile profile2Test2
    - Card: card1Test4WalletShare
      - TypeOfCardEnum.WALLET_SHARE
    - Card: card1Test4Vcard
      - TypeOfCardEnum.V_CARD
    - Card: card2Test4Website
      - TypeOfCardEnum.WEBSITE.
    - Card: card3Test4SocialNetwork
      - TypeOfCardEnum.SOCIAL_NETWORK
  - Profile profile3Test2 softDeleted
    - Card: card1Test5WalletShare softDeleted
      - TypeOfCardEnum.WALLET_SHARE
    - Card: card1Test5Vcard softDeleted
      - TypeOfCardEnum.V_CARD
    - Card: card2Test5Website softDeleted
      - TypeOfCardEnum.WEBSITE.
    - Card: card3Test5SocialNetwork softDeleted
      - TypeOfCardEnum.SOCIAL_NETWORK

User: userPublic3 :
  - Profile: profile1Test3
    - Card: card1Test5WalletShare
      - TypeOfCardEnum.WALLET_SHARE
    - Card: card1Test5Vcard
      - TypeOfCardEnum.V_CARD
    - Card: card2Test5Website
      - TypeOfCardEnum.WEBSITE.
    - Card: card3Test5SocialNetwork
      - TypeOfCardEnum.SOCIAL_NETWORK
  - Profile profile2Test3
    - Card: card1Test6WalletShare
      - TypeOfCardEnum.WALLET_SHARE
    - Card: card1Test6Vcard
      - TypeOfCardEnum.V_CARD
    - Card: card2Test6Website
*/
