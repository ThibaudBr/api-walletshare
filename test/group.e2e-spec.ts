import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppTestE2eModule } from './test-environment/app-test-e2e.module';
import * as request from 'supertest';
import supertest from 'supertest';
import { RoleProfileEnum } from '../src/api/profile/domain/enum/role-profile.enum';
import { TypeOfCardEnum } from '../src/api/card/domain/enum/type-of-card.enum';
import { GroupEntity } from '../src/api/groupe/domain/entities/group.entity';
import { RoleGroupMembershipEnum } from '../src/api/groupe/domain/enum/role-group-membership.enum';

if (process.env.NODE_ENV != 'test') {
  console.log('NODE_ENV must be set to test');
  throw new Error('NODE_ENV must be set to test');
}

describe('CardController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  let adminToken: string;
  let publicToken: string;
  let public2Token: string;
  let public4Token: string;

  let occupationIdList: string[];
  let userIdList: string[];
  let profileIdList: string[];
  let cardIdList: string[] = [];
  let socialNetworkIdList: string[];
  let connectCardIdList: string[];
  let groupIdList: string[];
  let groupMembershipIdList: string[];

  beforeAll(async () => {
    jest.setTimeout(10000);
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
    cardIdList = [];

    await request(app.getHttpServer()).get('/api/test/clear-database-test').expect(200);

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
      userId: string,
    ): Promise<supertest.Test> {
      return request(app.getHttpServer())
        .post('/api/test/create-profile-test')
        .send({ usernameProfile, roleProfile, occupationsId, userId })
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
          typeOfCardEnum: typeOfCard,
          ownerId: profileId,
        })
        .expect(201)
        .then(response => {
          cardIdList.push(response.body.id);
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

    const public5User = await createUser('public5Test', 'publicTest5@test.test.fr', 'Test123!', ['PUBLIC']);
    const public6User = await createUser('public5Test', 'publicTest5@test.test.fr', 'Test123!', ['PUBLIC']);
    const public7User = await createUser('public5Test', 'publicTest5@test.test.fr', 'Test123!', ['PUBLIC']);
    const public8User = await createUser('public5Test', 'publicTest5@test.test.fr', 'Test123!', ['PUBLIC']);
    const public9User = await createUser('public5Test', 'publicTest5@test.test.fr', 'Test123!', ['PUBLIC']);
    const public10User = await createUser('public5Test', 'publicTest5@test.test.fr', 'Test123!', ['PUBLIC']);
    userIdList.push(public5User.body.id);
    userIdList.push(public6User.body.id);
    userIdList.push(public7User.body.id);
    userIdList.push(public8User.body.id);
    userIdList.push(public9User.body.id);
    userIdList.push(public10User.body.id);

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

    const profile7 = await createProfile(
      'profile1Test3',
      RoleProfileEnum.CLASSIC,
      [occupationIdList[0], occupationIdList[1]],
      userIdList[3],
    );
    profileIdList.push(profile7.body.id);

    const profile8 = await createProfile(
      'profile1Test4',
      RoleProfileEnum.CLASSIC,
      [occupationIdList[0], occupationIdList[1]],
      userIdList[4],
    );

    const profile9 = await createProfile(
      'profile1Test5',
      RoleProfileEnum.CLASSIC,
      [occupationIdList[0], occupationIdList[1]],
      userIdList[5],
    );

    const profile10 = await createProfile(
      'profile1Test6',
      RoleProfileEnum.CLASSIC,
      [occupationIdList[0], occupationIdList[1]],
      userIdList[6],
    );

    const profile11 = await createProfile(
      'profile1Test7',
      RoleProfileEnum.CLASSIC,
      [occupationIdList[0], occupationIdList[1]],
      userIdList[7],
    );

    const profile12 = await createProfile(
      'profile1Test8',
      RoleProfileEnum.CLASSIC,
      [occupationIdList[0], occupationIdList[1]],
      userIdList[8],
    );

    const profile13 = await createProfile(
      'profile1Test9',
      RoleProfileEnum.CLASSIC,
      [occupationIdList[0], occupationIdList[1]],
      userIdList[9],
    );

    const profile14 = await createProfile(
      'profile1Test10',
      RoleProfileEnum.CLASSIC,
      [occupationIdList[0], occupationIdList[1]],
      userIdList[10],
    );
    profileIdList.push(profile8.body.id);
    profileIdList.push(profile9.body.id);
    profileIdList.push(profile10.body.id);
    profileIdList.push(profile11.body.id);
    profileIdList.push(profile12.body.id);
    profileIdList.push(profile13.body.id);
    profileIdList.push(profile14.body.id);

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

    // Profil 1 de l'utilisateur 3
    await createCard('card1Test7WalletShare', TypeOfCardEnum.WALLET_SHARE, profileIdList[6]); // 24
    await createCard('card1Test7Vcard', TypeOfCardEnum.V_CARD, profileIdList[6]); // 25
    await createCard('card2Test7Website', TypeOfCardEnum.WEBSITE, profileIdList[6]); // 26
    await createCard('card3Test7SocialNetwork', TypeOfCardEnum.SOCIAL_NETWORK, profileIdList[6]); // 27

    // profile 1 de l'utilisateur 4
    await createCard('card1Test8WalletShare', TypeOfCardEnum.WALLET_SHARE, profileIdList[7]); // 28
    // profile 1 de l'utilisateur 5
    await createCard('card1Test9WalletShare', TypeOfCardEnum.WALLET_SHARE, profileIdList[8]); // 29

    // profile 1 de l'utilisateur 6
    await createCard('card1Test10WalletShare', TypeOfCardEnum.WALLET_SHARE, profileIdList[9]); // 30

    // profile 1 de l'utilisateur 7
    await createCard('card1Test11WalletShare', TypeOfCardEnum.WALLET_SHARE, profileIdList[10]); // 31

    // profile 1 de l'utilisateur 8
    await createCard('card1Test12WalletShare', TypeOfCardEnum.WALLET_SHARE, profileIdList[11]); // 32

    // profile 1 de l'utilisateur 9
    await createCard('card1Test13WalletShare', TypeOfCardEnum.WALLET_SHARE, profileIdList[12]); // 33

    // profile 1 de l'utilisateur 10
    await createCard('card1Test14WalletShare', TypeOfCardEnum.WALLET_SHARE, profileIdList[13]); // 34

    connectCardIdList = [];

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
          cardId: id,
          connectedCardId: id2,
        })
        .then(res => {
          if (res.status != 200) {
            expect(res.body).toEqual('bob');
          }
          return res;
        });
    }

    await createConnectedCard(cardIdList[3], cardIdList[16]);
    await createConnectedCard(cardIdList[7], cardIdList[16]);
    await removeConnectedCard(cardIdList[7], cardIdList[16]);

    await createConnectedCard(cardIdList[0], cardIdList[20]);
    await createConnectedCard(cardIdList[3], cardIdList[20]);
    await createConnectedCard(cardIdList[7], cardIdList[20]);
    await removeConnectedCard(cardIdList[7], cardIdList[20]);

    // userId 1 profile 1 card 0
    await createConnectedCard(cardIdList[0], cardIdList[28]);
    await createConnectedCard(cardIdList[0], cardIdList[29]);
    await createConnectedCard(cardIdList[0], cardIdList[30]);
    await createConnectedCard(cardIdList[0], cardIdList[31]);
    await createConnectedCard(cardIdList[0], cardIdList[32]);
    await createConnectedCard(cardIdList[0], cardIdList[33]);
    await createConnectedCard(cardIdList[0], cardIdList[34]);

    // userId 1 profile 2 card 3 deleted card
    await createConnectedCard(cardIdList[8], cardIdList[28]);
    await createConnectedCard(cardIdList[8], cardIdList[29]);
    await createConnectedCard(cardIdList[8], cardIdList[30]);
    await createConnectedCard(cardIdList[8], cardIdList[31]);
    await createConnectedCard(cardIdList[8], cardIdList[32]);
    await createConnectedCard(cardIdList[8], cardIdList[33]);
    await createConnectedCard(cardIdList[8], cardIdList[34]);

    // userId 2 profile 1 card 12 removed connection
    await createConnectedCard(cardIdList[12], cardIdList[28]);
    await createConnectedCard(cardIdList[12], cardIdList[29]);
    await createConnectedCard(cardIdList[12], cardIdList[30]);
    await createConnectedCard(cardIdList[12], cardIdList[31]);
    await createConnectedCard(cardIdList[12], cardIdList[32]);
    await createConnectedCard(cardIdList[12], cardIdList[33]);
    await createConnectedCard(cardIdList[12], cardIdList[34]);

    for (const cardId of cardIdList.slice(28, 34)) {
      await request(app.getHttpServer())
        .put('/api/test/remove-connected-card-test')
        .send({
          cardId: cardIdList[12],
          connectedCardId: cardId,
        })
        .expect(200);
    }
    for (const cardId of cardIdList.slice(8, 11)) {
      await request(app.getHttpServer())
        .delete('/api/test/remove-card-test/' + cardId)
        .expect(200);
    }

    for (const cardId of cardIdList.slice(20, 23)) {
      await request(app.getHttpServer())
        .delete('/api/test/remove-card-test/' + cardId)
        .expect(200);
    }
    for (const cardId of cardIdList.slice(24, 27)) {
      await request(app.getHttpServer())
        .delete('/api/test/remove-card-test/' + cardId)
        .expect(200);
    }
    await request(app.getHttpServer())
      .delete('/api/test/remove-profile-test/' + profile3.body.id)
      .expect(200);
    await request(app.getHttpServer())
      .delete('/api/test/remove-profile-test/' + profile6.body.id)
      .expect(200);

    await request(app.getHttpServer())
      .delete('/api/test/remove-profile-test/' + profile7.body.id)
      .expect(200);

    // _______________________________
    // Group
    // _______________________________

    groupIdList = [];
    groupMembershipIdList = [];
    async function createGroupTest(name: string, cardId: string): Promise<void> {
      await request(app.getHttpServer())
        .post('/api/test/create-group-test')
        .send({
          name: name,
          cardId: cardId,
        })
        .expect(200)
        .then(res => {
          groupIdList.push(res.body.id);
        });
    }

    async function removeGroupTest(groupId: string): Promise<void> {
      await request(app.get)
        .delete('/api/test/remove-group-test/' + groupId)
        .expect(200);
    }

    async function addGroupMembershipTest(
      groupId: string,
      cardId: string,
      role: RoleGroupMembershipEnum,
    ): Promise<void> {
      await request(app.getHttpServer())
        .post('/api/test/add-group-membership-test/' + role)
        .send({
          groupId: groupId,
          cardIdList: [cardId],
        })
        .expect(200)
        .then(res => {
          groupMembershipIdList.push(res.body.id);
        });
    }

    async function removeGroupMembershipTest(groupMembershipId: string): Promise<void> {
      await request(app.getHttpServer())
        .put('/api/test/remove-group-membership-test/' + groupMembershipId)
        .expect(200);
    }

    await createGroupTest('group1Public1Card0', cardIdList[0]); // 0 Personne dans le groupe
    await createGroupTest('group2Public1Card0', cardIdList[0]); // 1 card 28 a 34 dans le groupe
    await createGroupTest('group3Public1Card0', cardIdList[0]); // 2 card 28 a 34 dans le groupe mais removed
    await createGroupTest('group4Public1Card8', cardIdList[8]);

    await addGroupMembershipTest(groupIdList[1], cardIdList[28], RoleGroupMembershipEnum.ADMIN); // 0
    await addGroupMembershipTest(groupIdList[1], cardIdList[29], RoleGroupMembershipEnum.ADMIN); // 1
    await addGroupMembershipTest(groupIdList[1], cardIdList[30], RoleGroupMembershipEnum.MEMBER); // 2
    await addGroupMembershipTest(groupIdList[1], cardIdList[31], RoleGroupMembershipEnum.MEMBER); // 3
    await addGroupMembershipTest(groupIdList[1], cardIdList[32], RoleGroupMembershipEnum.MEMBER); // 4
    await addGroupMembershipTest(groupIdList[1], cardIdList[33], RoleGroupMembershipEnum.MEMBER); // 5
    await addGroupMembershipTest(groupIdList[1], cardIdList[34], RoleGroupMembershipEnum.MEMBER); // 6

    await addGroupMembershipTest(groupIdList[2], cardIdList[28], RoleGroupMembershipEnum.ADMIN); // 7
    await addGroupMembershipTest(groupIdList[2], cardIdList[29], RoleGroupMembershipEnum.ADMIN); // 8
    await addGroupMembershipTest(groupIdList[2], cardIdList[30], RoleGroupMembershipEnum.MEMBER); // 9
    await addGroupMembershipTest(groupIdList[2], cardIdList[31], RoleGroupMembershipEnum.MEMBER); // 10
    await addGroupMembershipTest(groupIdList[2], cardIdList[32], RoleGroupMembershipEnum.MEMBER); // 11
    await addGroupMembershipTest(groupIdList[2], cardIdList[33], RoleGroupMembershipEnum.MEMBER); // 12
    await addGroupMembershipTest(groupIdList[2], cardIdList[34], RoleGroupMembershipEnum.MEMBER); // 13

    await addGroupMembershipTest(groupIdList[3], cardIdList[28], RoleGroupMembershipEnum.ADMIN); // 14
    await addGroupMembershipTest(groupIdList[3], cardIdList[29], RoleGroupMembershipEnum.ADMIN); // 15
    await addGroupMembershipTest(groupIdList[3], cardIdList[30], RoleGroupMembershipEnum.MEMBER); // 16
    await addGroupMembershipTest(groupIdList[3], cardIdList[31], RoleGroupMembershipEnum.MEMBER); // 17
    await addGroupMembershipTest(groupIdList[3], cardIdList[32], RoleGroupMembershipEnum.MEMBER); // 18
    await addGroupMembershipTest(groupIdList[3], cardIdList[33], RoleGroupMembershipEnum.MEMBER); // 19
    await addGroupMembershipTest(groupIdList[3], cardIdList[34], RoleGroupMembershipEnum.MEMBER); // 20

    await removeGroupMembershipTest(groupMembershipIdList[7]);
    await removeGroupMembershipTest(groupMembershipIdList[8]);
    await removeGroupMembershipTest(groupMembershipIdList[9]);
    await removeGroupMembershipTest(groupMembershipIdList[10]);
    await removeGroupMembershipTest(groupMembershipIdList[11]);
    await removeGroupMembershipTest(groupMembershipIdList[12]);
    await removeGroupMembershipTest(groupMembershipIdList[13]);

    await removeGroupMembershipTest(groupMembershipIdList[14]);
    await removeGroupMembershipTest(groupMembershipIdList[15]);
    await removeGroupMembershipTest(groupMembershipIdList[16]);
    await removeGroupMembershipTest(groupMembershipIdList[17]);
    await removeGroupMembershipTest(groupMembershipIdList[18]);
    await removeGroupMembershipTest(groupMembershipIdList[19]);
    await removeGroupMembershipTest(groupMembershipIdList[20]);

    await removeGroupTest(groupIdList[2]);
  });
});
