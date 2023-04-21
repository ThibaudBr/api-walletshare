import { Injectable } from '@nestjs/common';
import { ConnectedCardEntity } from '../../../src/api/card/domain/entities/connected-card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardEntity } from '../../../src/api/card/domain/entities/card.entity';
import { ProfileEntity } from '../../../src/api/profile/domain/entities/profile.entity';
import { CreateCardRequest } from '../../../src/api/card/web/request/create-card.request';

@Injectable()
export class CardTestE2eService {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
    @InjectRepository(ConnectedCardEntity)
    private readonly connectedCardRepository: Repository<ConnectedCardEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
  ) {}

  async createCardTest(createCardRequest: CreateCardRequest): Promise<CardEntity> {
    try {
      const newCard = new CardEntity({
        ...createCardRequest,
      });
      newCard.owner = await this.profileRepository.findOneOrFail({
        where: {
          id: createCardRequest.ownerId,
        },
      });

      return await this.cardRepository.save(newCard);
    } catch (e) {
      throw e;
    }
  }

  async removeCard(cardId: string): Promise<void> {
    await this.cardRepository.softDelete(cardId);
  }

  async getCard(cardId: string): Promise<CardEntity | null> {
    return await this.cardRepository.findOne({
      withDeleted: true,
      relations: ['owner', 'connectedCards', 'owner.user', 'connectedCards.owner', 'connectedCards.owner.user'],
      where: {
        id: cardId,
      },
    });
  }

  async getAllCards(): Promise<CardEntity[]> {
    return await this.cardRepository.find({
      withDeleted: true,
      relations: ['owner', 'connectedCards', 'owner.user', 'connectedCards.owner', 'connectedCards.owner.user'],
    });
  }

  async addConnectedCard(cardId: string, connectedCardId: string): Promise<void> {
    const card = await this.cardRepository.findOneOrFail({
      withDeleted: true,
      where: {
        id: cardId,
      },
    });
    const connectedCard = await this.cardRepository.findOneOrFail({
      withDeleted: true,
      where: {
        id: connectedCardId,
      },
    });
    const connectedCardEntity = new ConnectedCardEntity();
    connectedCardEntity.cardEntityOne = card;
    connectedCardEntity.cardEntityTwo = connectedCard;
    await this.connectedCardRepository.save(connectedCardEntity);
  }

  async removeConnectedCard(cardId: string, connectedCardId: string): Promise<void> {
    const card = await this.cardRepository.findOneOrFail({
      withDeleted: true,
      where: {
        id: cardId,
      },
    });
    const connectedCard = await this.cardRepository.findOneOrFail({
      withDeleted: true,
      where: {
        id: connectedCardId,
      },
    });
    const connectedCardEntity = await this.connectedCardRepository.findOneOrFail({
      relations: ['cardEntityOne', 'cardEntityTwo'],
      withDeleted: true,
      where: {
        cardEntityOne: {
          id: card.id,
        },
        cardEntityTwo: {
          id: connectedCard.id,
        },
      },
    });
    await this.connectedCardRepository.softDelete(connectedCardEntity.id);
  }

  async getConnectedCards(cardId: string): Promise<CardEntity[]> {
    const card = await this.cardRepository.findOneOrFail({
      withDeleted: true,
      where: {
        id: cardId,
      },
    });
    const connectedCards = await this.connectedCardRepository.find({
      relations: ['cardEntityOne', 'cardEntityTwo'],
      withDeleted: true,
      where: [
        {
          cardEntityOne: {
            id: card.id,
          },
        },
        {
          cardEntityTwo: {
            id: card.id,
          },
        },
      ],
    });
    return connectedCards.map(connectedCard => connectedCard.cardEntityTwo);
  }

  async addCardCount(cardId: string): Promise<void> {
    const card = await this.cardRepository.findOneOrFail({
      withDeleted: true,
      where: {
        id: cardId,
      },
    });
    card.numberOfShares++;
    await this.cardRepository.save(card);
  }

  async addSavedCard(cardId: string, profileId: string): Promise<void> {
    const card = await this.cardRepository.findOneOrFail({
      withDeleted: true,
      where: {
        id: cardId,
      },
    });
    const profile = await this.profileRepository.findOneOrFail({
      withDeleted: true,
      where: {
        id: profileId,
      },
    });
    card.profilesWhoSavedCard.push(profile);
    await this.cardRepository.save(card);
  }

  async removeSavedCard(cardId: string, profileId: string): Promise<void> {
    const card = await this.cardRepository.findOneOrFail({
      withDeleted: true,
      where: {
        id: cardId,
      },
    });
    const profile = await this.profileRepository.findOneOrFail({
      withDeleted: true,
      where: {
        id: profileId,
      },
    });
    card.profilesWhoSavedCard = card.profilesWhoSavedCard.filter(
      profileWhoSavedCard => profileWhoSavedCard.id !== profile.id,
    );
    await this.cardRepository.save(card);
  }

  async getSavedCards(profileId: string): Promise<CardEntity[]> {
    const profile = await this.profileRepository.findOneOrFail({
      withDeleted: true,
      relations: ['savedCard'],
      where: {
        id: profileId,
      },
    });
    if (!profile.savedCard) return [];
    return profile.savedCard;
  }
}
