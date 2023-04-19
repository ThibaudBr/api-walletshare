import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes } from '@nestjs/common';
import { CardTestE2eService } from '../service-test/card-test-e2e.service';
import { CreateCardRequest } from '../../../src/api/card/web/request/create-card.request';
import { CardEntity } from '../../../src/api/card/domain/entities/card.entity';
import { IsTestEnvironmentPipe } from '../../../src/util/pipe/is-test-environment.pipe';

@Controller()
export class CardTestE2eController {
  constructor(private readonly cardTestE2eService: CardTestE2eService) {}

  @UsePipes(new IsTestEnvironmentPipe())
  @Post('/api/test/create-card-test')
  createCardTest(@Body() createCardRequest: CreateCardRequest): Promise<CardEntity> {
    return this.cardTestE2eService.createCardTest(createCardRequest);
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Delete('/api/test/remove-card-test/:id')
  removeCardTest(@Param('id') id: string): Promise<void> {
    return this.cardTestE2eService.removeCard(id);
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Get('/api/test/get-all-cards-test')
  getAllCardsTest(): Promise<CardEntity[]> {
    return this.cardTestE2eService.getAllCards();
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Get('/api/test/get-card-test/:id')
  getCardTest(@Param('id') cardId: string): Promise<CardEntity | null> {
    return this.cardTestE2eService.getCard(cardId);
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Post('/api/test/add-connected-card-test')
  addConnectedCardTest(
    @Body() { cardId, connectedCardId }: { cardId: string; connectedCardId: string },
  ): Promise<void> {
    return this.cardTestE2eService.addConnectedCard(cardId, connectedCardId);
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Put('/api/test/remove-connected-card-test')
  removeConnectedCardTest(
    @Body() { cardId, connectedCardId }: { cardId: string; connectedCardId: string },
  ): Promise<void> {
    return this.cardTestE2eService.removeConnectedCard(cardId, connectedCardId);
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Get('/api/test/get-connected-cards-test/:id')
  getConnectedCardsTest(@Param('id') cardId: string): Promise<CardEntity[]> {
    return this.cardTestE2eService.getConnectedCards(cardId);
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Put('/api/test/add-card-count-test/:id')
  addCardCountTest(@Param('id') cardId: string): Promise<void> {
    return this.cardTestE2eService.addCardCount(cardId);
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Post('/api/test/add-saved-card-test')
  addSavedCardTest(@Body() { cardId, profileId }: { cardId: string; profileId: string }): Promise<void> {
    return this.cardTestE2eService.addSavedCard(cardId, profileId);
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Delete('/api/test/remove-saved-card-test')
  removeSavedCardTest(@Body() { cardId, profileId }: { cardId: string; profileId: string }): Promise<void> {
    return this.cardTestE2eService.removeSavedCard(cardId, profileId);
  }

  @UsePipes(new IsTestEnvironmentPipe())
  @Get('/api/test/get-saved-cards-test/:profileId')
  getSavedCardsTest(@Param('profileId') profileId: string): Promise<CardEntity[]> {
    return this.cardTestE2eService.getSavedCards(profileId);
  }
}
