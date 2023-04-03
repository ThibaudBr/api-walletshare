import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InvalidIdException } from '../../util/exception/custom-http-exception/invalid-id.exception';
import { IsCardOwnerWithUserIdQuery } from './cqrs/query/is-card-owner-with-user-id.query';
import { AddConnectedCardCommand } from './cqrs/command/add-connected-card.command';
import { UnauthorizedRequestException } from '../../util/exception/custom-http-exception/unauthorized-request.exception';
import { AddSavedCardCommand } from './cqrs/command/add-saved-card.command';
import { IsProfileOwnerWithUserIsQuery } from './cqrs/query/is-profile-owner-with-user-is.query';
import { AddViewCountCardCommand } from './cqrs/command/add-view-count-card.command';
import { CreateCardCommand } from './cqrs/command/create-card.command';
import { DeleteCardCommand } from './cqrs/command/delete-card.command';
import { RemoveConnectedCardCommand } from './cqrs/command/remove-connected-card.command';
import { RestoreCardCommand } from './cqrs/command/restore-card.command';
import { SoftDeleteCardCommand } from './cqrs/command/soft-delete-card.command';
import { UpdateCardCommand } from './cqrs/command/update-card.command';
import { CardResponse } from './web/response/card.response';
import { GetAllCardQuery } from './cqrs/query/get-all-card.query';
import { GetCardByIdQuery } from './cqrs/query/get-card-by-id.query';
import { CardEntity } from './domain/entities/card.entity';
import { ProfileResponse } from '../profile/domain/response/profile.response';
import { SocialNetworkResponse } from '../social-network/web/response/social-network.response';
import { GroupMembershipResponse } from '../entities-to-create/response/group-membership.response';
import { GetAllCardWithProfileIdQuery } from './cqrs/query/get-all-card-with-profile-id.query';
import { GetCardWithCriteriaRequest } from './web/request/get-card-with-criteria.request';
import { GetCardWithCriteriaQuery } from './cqrs/query/get-card-with-criteria.query';
import { GetSavedCardWithUserIdQuery } from './cqrs/query/get-saved-card-with-user-id.query';
import { GetSavedCardWithProfileIdQuery } from './cqrs/query/get-saved-card-with-profile-id.query';
import { GetAllCardWithUserIdQuery } from './cqrs/query/get-all-card-with-user-id.query';
import { RemoveSavedCardCommand } from './cqrs/command/remove-saved-card.command';
import { CreateCardRequest } from './web/request/create-card.request';
import { UpdateCardRequest } from './web/request/update-card.request';

@Injectable()
export class CardService {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  async getAllCards(): Promise<CardResponse[]> {
    try {
      return this.queryBus
        .execute(new GetAllCardQuery())
        .then((cards: CardEntity[]) => {
          return cards.map((card: CardEntity) => {
            return new CardResponse({
              ...card,
              owner: card.owner ? new ProfileResponse({ ...card.owner }) : undefined,
              socialNetwork: card.socialNetwork ? new SocialNetworkResponse({ ...card.socialNetwork }) : undefined,
              groupMemberships: card.groupMemberships
                ? card.groupMemberships.map(groupMembership => new GroupMembershipResponse({ ...groupMembership }))
                : undefined,
            });
          });
        })
        .catch(error => {
          throw new InternalServerErrorException(error);
        });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getCardById(cardId: string): Promise<CardResponse> {
    try {
      return this.queryBus
        .execute(new GetCardByIdQuery({ id: cardId }))
        .then((card: CardEntity) => {
          return new CardResponse({
            ...card,
            owner: card.owner ? new ProfileResponse({ ...card.owner }) : undefined,
            socialNetwork: card.socialNetwork ? new SocialNetworkResponse({ ...card.socialNetwork }) : undefined,
            groupMemberships: card.groupMemberships
              ? card.groupMemberships.map(groupMembership => new GroupMembershipResponse({ ...groupMembership }))
              : undefined,
          });
        })
        .catch(error => {
          throw new InternalServerErrorException(error);
        });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllCardWithUserId(userId: string): Promise<CardResponse[]> {
    try {
      return this.queryBus
        .execute(new GetAllCardWithUserIdQuery({ userId: userId }))
        .then((cards: CardEntity[]) => {
          return cards.map((card: CardEntity) => {
            return new CardResponse({
              ...card,
              owner: card.owner ? new ProfileResponse({ ...card.owner }) : undefined,
              socialNetwork: card.socialNetwork ? new SocialNetworkResponse({ ...card.socialNetwork }) : undefined,
              groupMemberships: card.groupMemberships
                ? card.groupMemberships.map(groupMembership => new GroupMembershipResponse({ ...groupMembership }))
                : undefined,
            });
          });
        })
        .catch(error => {
          throw new InternalServerErrorException(error);
        });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllMyCardWithProfileId(userId: string, profileId: string): Promise<CardResponse[]> {
    try {
      if (await this.isProfileOwner(userId, profileId)) {
        return this.queryBus
          .execute(new GetAllCardWithProfileIdQuery({ profileId: profileId }))
          .then((cards: CardEntity[]) => {
            return cards.map((card: CardEntity) => {
              return new CardResponse({
                ...card,
                owner: card.owner ? new ProfileResponse({ ...card.owner }) : undefined,
                socialNetwork: card.socialNetwork ? new SocialNetworkResponse({ ...card.socialNetwork }) : undefined,
                groupMemberships: card.groupMemberships
                  ? card.groupMemberships.map(groupMembership => new GroupMembershipResponse({ ...groupMembership }))
                  : undefined,
              });
            });
          })
          .catch(error => {
            throw new InternalServerErrorException(error);
          });
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Unauthorized') throw new UnauthorizedException('Unauthorized');
      else throw new InternalServerErrorException(error);
    }
  }

  async getAllCardWithProfileId(profileId: string): Promise<CardResponse[]> {
    try {
      return this.queryBus
        .execute(new GetAllCardWithProfileIdQuery({ profileId: profileId }))
        .then((cards: CardEntity[]) => {
          return cards.map((card: CardEntity) => {
            return new CardResponse({
              ...card,
              owner: card.owner ? new ProfileResponse({ ...card.owner }) : undefined,
              socialNetwork: card.socialNetwork ? new SocialNetworkResponse({ ...card.socialNetwork }) : undefined,
              groupMemberships: card.groupMemberships
                ? card.groupMemberships.map(groupMembership => new GroupMembershipResponse({ ...groupMembership }))
                : undefined,
            });
          });
        })
        .catch(error => {
          throw new InternalServerErrorException(error);
        });
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Unauthorized') throw new UnauthorizedException('Unauthorized');
      else if (error.message === 'Profile not found') throw new InvalidIdException(' for profile');
      throw new InternalServerErrorException(error);
    }
  }

  async getCardWithCriteria(criteria: GetCardWithCriteriaRequest): Promise<CardResponse[]> {
    try {
      return this.queryBus.execute(new GetCardWithCriteriaQuery({ ...criteria })).then((cards: CardEntity[]) => {
        return cards.map((card: CardEntity) => {
          return new CardResponse({
            ...card,
            owner: card.owner ? new ProfileResponse({ ...card.owner }) : undefined,
            socialNetwork: card.socialNetwork ? new SocialNetworkResponse({ ...card.socialNetwork }) : undefined,
            groupMemberships: card.groupMemberships
              ? card.groupMemberships.map(groupMembership => new GroupMembershipResponse({ ...groupMembership }))
              : undefined,
          });
        });
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getSavedCardWithUserId(userId: string): Promise<CardResponse[]> {
    try {
      return this.queryBus
        .execute(new GetSavedCardWithUserIdQuery({ userId: userId }))
        .then((cards: CardEntity[]) => {
          return cards.map((card: CardEntity) => {
            return new CardResponse({
              ...card,
              owner: card.owner ? new ProfileResponse({ ...card.owner }) : undefined,
              socialNetwork: card.socialNetwork ? new SocialNetworkResponse({ ...card.socialNetwork }) : undefined,
              groupMemberships: card.groupMemberships
                ? card.groupMemberships.map(groupMembership => new GroupMembershipResponse({ ...groupMembership }))
                : undefined,
            });
          });
        })
        .catch(error => {
          throw new InternalServerErrorException(error);
        });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getMySavedCardWithProfileId(userId: string, profileId: string): Promise<CardResponse[]> {
    try {
      if (await this.isProfileOwner(userId, profileId)) {
        return this.queryBus
          .execute(new GetSavedCardWithProfileIdQuery({ profileId: profileId }))
          .then((cards: CardEntity[]) => {
            return cards.map((card: CardEntity) => {
              return new CardResponse({
                ...card,
                owner: card.owner ? new ProfileResponse({ ...card.owner }) : undefined,
                socialNetwork: card.socialNetwork ? new SocialNetworkResponse({ ...card.socialNetwork }) : undefined,
                groupMemberships: card.groupMemberships
                  ? card.groupMemberships.map(groupMembership => new GroupMembershipResponse({ ...groupMembership }))
                  : undefined,
              });
            });
          })
          .catch(error => {
            throw new InternalServerErrorException(error);
          });
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Unauthorized') throw new UnauthorizedException('Unauthorized');
      else if (error.message === 'Profile not found') throw new InvalidIdException(' for profile');
      throw new InternalServerErrorException(error);
    }
  }

  async getSavedCardWithProfileId(profileId: string): Promise<CardResponse[]> {
    try {
      return this.queryBus
        .execute(new GetSavedCardWithProfileIdQuery({ profileId: profileId }))
        .then((cards: CardEntity[]) => {
          return cards.map((card: CardEntity) => {
            return new CardResponse({
              ...card,
              owner: card.owner ? new ProfileResponse({ ...card.owner }) : undefined,
              socialNetwork: card.socialNetwork ? new SocialNetworkResponse({ ...card.socialNetwork }) : undefined,
              groupMemberships: card.groupMemberships
                ? card.groupMemberships.map(groupMembership => new GroupMembershipResponse({ ...groupMembership }))
                : undefined,
            });
          });
        });
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Unauthorized') throw new UnauthorizedException('Unauthorized');
      else if (error.message === 'Profile not found') throw new InvalidIdException(' for profile');
      else throw new InternalServerErrorException(error);
    }
  }
  async addConnectedCardToMyCard(userId: string, cardId: string, connectedCardId: string): Promise<void> {
    try {
      if (await this.isCardOwnerWithUserId(userId, cardId)) {
        return await this.commandBus.execute(
          new AddConnectedCardCommand({
            cardId: cardId,
            connectedCardId: connectedCardId,
          }),
        );
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Card not found') throw new InvalidIdException(' for card');
      else if (error.message === 'Card of sender not found') throw new InvalidIdException(' for card sender');
      else if (error.message === 'Card of receiver not found') throw new InvalidIdException(' for card receiver');
      else if (error.message === 'Card already connected') throw new BadRequestException('Card already connected');
      else if (error.message === 'Unauthorized') throw new UnauthorizedRequestException();
      else throw error;
    }
  }

  async addConnectedCard(cardId: string, connectedCardId: string): Promise<void> {
    try {
      return await this.commandBus.execute(
        new AddConnectedCardCommand({
          cardId: cardId,
          connectedCardId: connectedCardId,
        }),
      );
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Card not found') throw new InvalidIdException(' for card');
      else if (error.message === 'Card of sender not found') throw new InvalidIdException(' for card sender');
      else if (error.message === 'Card of receiver not found') throw new InvalidIdException(' for card receiver');
      else if (error.message === 'Card already connected') throw new BadRequestException('Card already connected');
      else if (error.message === 'Unauthorized') throw new UnauthorizedRequestException();
      else throw error;
    }
  }

  async addSavedCardToMyCard(userId: string, cardId: string, profileId: string): Promise<void> {
    try {
      if (await this.isProfileOwner(userId, profileId)) {
        return await this.commandBus.execute(
          new AddSavedCardCommand({
            cardId: cardId,
            profileId: profileId,
          }),
        );
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Card not found') throw new InvalidIdException(' for card');
      else if (error.message === 'Card of sender not found') throw new InvalidIdException(' for card sender');
      else if (error.message === 'Card of receiver not found') throw new InvalidIdException(' for card receiver');
      else if (error.message === 'Card already connected') throw new BadRequestException('Card already connected');
      else if (error.message === 'Unauthorized') throw new UnauthorizedRequestException();
      else throw error;
    }
  }

  async addViewCount(cardId: string): Promise<void> {
    try {
      return await this.commandBus.execute(
        new AddViewCountCardCommand({
          cardId: cardId,
        }),
      );
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Card not found') throw new InvalidIdException(' for card');
      else if (error.message === 'Unauthorized') throw new UnauthorizedRequestException();
      else throw error;
    }
  }

  async createCardForMe(userId: string, profileId: string, card: CreateCardRequest): Promise<void> {
    try {
      if (await this.isProfileOwner(userId, profileId)) {
        return await this.commandBus.execute(
          new CreateCardCommand({
            ...card,
            profileId: profileId,
          }),
        );
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Profile not found') throw new InvalidIdException(' for profile');
      else if (error.message === 'Unauthorized') throw new UnauthorizedRequestException();
      else throw error;
    }
  }

  async createCard(profileId: string, card: CreateCardRequest): Promise<void> {
    try {
      return await this.commandBus.execute(
        new CreateCardCommand({
          ...card,
          profileId: profileId,
        }),
      );
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Profile not found') throw new InvalidIdException(' for profile');
      else if (error.message === 'Social Network not found') throw new InvalidIdException(' for social network');
      else if (error.message === 'Occupation not found') throw new InvalidIdException(' for occupation');
      else if (error.message === 'Error saving card') throw new InternalServerErrorException('Error saving card');
      else if (error.message === 'Unauthorized') throw new UnauthorizedRequestException();
      else throw error;
    }
  }

  async deleteCard(cardId: string): Promise<void> {
    try {
      return await this.commandBus.execute(
        new DeleteCardCommand({
          id: cardId,
        }),
      );
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Card not found') throw new InvalidIdException(' for card');
      else if (error.message === 'Unauthorized') throw new UnauthorizedRequestException();
      else throw error;
    }
  }

  async removeConnectedCardFromMyCard(userId: string, cardId: string, connectedCardId: string): Promise<void> {
    try {
      if (
        (await this.isCardOwnerWithUserId(userId, cardId)) ||
        (await this.isCardOwnerWithUserId(userId, connectedCardId))
      ) {
        await this.commandBus.execute(
          new RemoveConnectedCardCommand({
            id: cardId,
            connectedCardId: connectedCardId,
          }),
        );
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Card not found') throw new InvalidIdException(' for card');
      else if (error.message === 'Unauthorized') throw new UnauthorizedRequestException();
      else throw error;
    }
  }

  async removeConnectedCard(cardId: string, connectedCardId: string): Promise<void> {
    try {
      return await this.commandBus.execute(
        new RemoveConnectedCardCommand({
          id: cardId,
          connectedCardId: connectedCardId,
        }),
      );
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Card not found') throw new InvalidIdException(' for card');
      else throw error;
    }
  }

  async isCardOwnerWithUserId(userId: string, cardId: string): Promise<boolean> {
    try {
      return await this.queryBus.execute(
        new IsCardOwnerWithUserIdQuery({
          userId: userId,
          cardId: cardId,
        }),
      );
    } catch (e) {
      throw new InvalidIdException();
    }
  }

  async isProfileOwner(userId: string, profileId: string): Promise<boolean> {
    try {
      return await this.queryBus.execute(
        new IsProfileOwnerWithUserIsQuery({
          userId: userId,
          profileId: profileId,
        }),
      );
    } catch (error) {
      throw new InvalidIdException();
    }
  }

  async restoreCard(cardId: string): Promise<void> {
    try {
      return await this.commandBus.execute(
        new RestoreCardCommand({
          id: cardId,
        }),
      );
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Card not found') throw new InvalidIdException(' for card');
      else if (error.message === 'Unauthorized') throw new UnauthorizedRequestException();
      else throw error;
    }
  }

  async softDeleteMyCard(userId: string, cardId: string): Promise<void> {
    try {
      if (await this.isCardOwnerWithUserId(userId, cardId)) {
        return await this.commandBus.execute(
          new SoftDeleteCardCommand({
            id: cardId,
          }),
        );
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Card not found') throw new InvalidIdException(' for card');
      else if (error.message === 'Unauthorized') throw new UnauthorizedRequestException();
      else throw error;
    }
  }

  async softDeleteCard(cardId: string): Promise<void> {
    try {
      return await this.commandBus.execute(
        new SoftDeleteCardCommand({
          id: cardId,
        }),
      );
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Card not found') throw new InvalidIdException(' for card');
      else if (error.message === 'Unauthorized') throw new UnauthorizedRequestException();
      else throw error;
    }
  }

  async updateMyCard(userId: string, cardId: string, card: UpdateCardRequest): Promise<void> {
    try {
      if (await this.isCardOwnerWithUserId(userId, cardId)) {
        return await this.commandBus.execute(
          new UpdateCardCommand({
            ...card,
            cardId: cardId,
          }),
        );
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Card not found') throw new InvalidIdException(' for card');
      else if (error.message === 'Profile not found') throw new InvalidIdException(' for profile');
      else if (error.message === 'Social Network not found') throw new InvalidIdException(' for social network');
      else if (error.message === 'Occupation not found') throw new InvalidIdException(' for occupation');
      else if (error.message === 'Error saving card') throw new InternalServerErrorException('Error saving card');
      else if (error.message === 'Unauthorized') throw new UnauthorizedRequestException();
      else throw error;
    }
  }

  async updateCard(cardId: string, card: UpdateCardRequest): Promise<void> {
    try {
      return await this.commandBus.execute(
        new UpdateCardCommand({
          ...card,
          cardId: cardId,
        }),
      );
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Card not found') throw new InvalidIdException(' for card');
      else if (error.message === 'Profile not found') throw new InvalidIdException(' for profile');
      else if (error.message === 'Social Network not found') throw new InvalidIdException(' for social network');
      else if (error.message === 'Occupation not found') throw new InvalidIdException(' for occupation');
      else if (error.message === 'Error saving card') throw new InternalServerErrorException('Error saving card');
      else if (error.message === 'Unauthorized') throw new UnauthorizedRequestException();
      else throw error;
    }
  }

  async removeSavedCardFromMyCard(userId: string, cardId: string, profileId: string): Promise<void> {
    try {
      if (await this.isProfileOwner(userId, cardId)) {
        await this.commandBus.execute(
          new RemoveSavedCardCommand({
            cardId: cardId,
            profileId: profileId,
          }),
        );
      } else {
        throw new Error('Unauthorized');
      }
    } catch (error) {
      if (error instanceof InvalidIdException) throw new InvalidIdException(' for userId');
      else if (error.message === 'Card not found') throw new InvalidIdException(' for card');
      else if (error.message === 'Unauthorized') throw new UnauthorizedRequestException();
      else throw error;
    }
  }
}
