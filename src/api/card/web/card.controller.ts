import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CardService } from '../application/card.service';
import { RoleGuard } from '../../auth/web/guards/role.guard';
import { UserRoleEnum } from '../../user/domain/enum/user-role.enum';
import { CardResponse } from './response/card.response';
import { RequestUser } from '../../auth/domain/interface/request-user.interface';
import { GetCardWithCriteriaRequest } from './request/get-card-with-criteria.request';
import { AddConnectedCardRequest } from './request/add-connected-card.request';
import { RemoveConnectedCardRequest } from './request/remove-connected-card.request';
import { AddSavedCardRequest } from './request/add-saved-card.request';
import { RemoveSavedCardRequest } from './request/remove-saved-card.request';
import { CreateCardRequest } from './request/create-card.request';
import { UpdateCardRequest } from './request/update-card.request';

@Controller('card')
@ApiTags('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get('/admin/get-all-cards')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAllCard(): Promise<CardResponse[]> {
    return await this.cardService.getAllCards();
  }

  @Get('/public/get-card-by-id/:id')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getCardById(@Param('id') cardId: string): Promise<CardResponse> {
    return await this.cardService.getCardById(cardId);
  }

  @Get('/admin/get-all-cards/:userId')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAllCardsByUserId(@Param('userId') userId: string): Promise<CardResponse[]> {
    return await this.cardService.getAllCardWithUserId(userId);
  }

  @Get('/public/get-all-my-cards/')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getAllMyCards(@Req() userRequest: RequestUser): Promise<CardResponse[]> {
    return await this.cardService.getAllCardWithUserId(userRequest.user.id);
  }

  @Get('/public/get-all-my-connected-cards/')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getAllMyConnectedCard(@Req() userRequest: RequestUser): Promise<CardResponse[]> {
    return await this.cardService.getAllMyConnectedCard(userRequest.user.id);
  }

  @Get('/public/get-all-my-cards-by-profile-id/:profileId')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getAllMyCardsWithProfileId(
    @Param('profileId') profileId: string,
    @Req() userRequest: RequestUser,
  ): Promise<CardResponse[]> {
    return await this.cardService.getAllMyCardWithProfileId(userRequest.user.id, profileId);
  }

  @Get('/admin/get-all-cards-by-profile-id/:profileId')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAllCardsWithProfileId(@Param('profileId') profileId: string): Promise<CardResponse[]> {
    return await this.cardService.getAllCardWithProfileId(profileId);
  }

  @Post('/admin/get-with-criteria')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAllCardsWithCriteria(@Body() criteria: GetCardWithCriteriaRequest): Promise<CardResponse[]> {
    return await this.cardService.getCardWithCriteria(criteria);
  }

  @Get('/admin/get-saved-cards-with-user-id/:userId')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getSavedCardsWithUserId(@Param('userId') userId: string): Promise<CardResponse[]> {
    return await this.cardService.getSavedCardWithUserId(userId);
  }

  @Get('/public/get-my-saved-cards-with-user-id')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getMySavedCardsWithUserId(@Req() userRequest: RequestUser): Promise<CardResponse[]> {
    return await this.cardService.getSavedCardWithUserId(userRequest.user.id);
  }

  @Get('/admin/get-saved-cards-with-profile-id/:profileId')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getSavedCardsWithProfileId(@Param('profileId') profileId: string): Promise<CardResponse[]> {
    return await this.cardService.getSavedCardWithProfileId(profileId);
  }

  @Get('/public/get-my-saved-cards-with-profile-id/:profileId')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getMySavedCardsWithProfileId(
    @Param('profileId') profileId: string,
    @Req() userRequest: RequestUser,
  ): Promise<CardResponse[]> {
    return await this.cardService.getMySavedCardWithProfileId(userRequest.user.id, profileId);
  }

  @Get('/public/get-my-connected-cards-with-profile-id/:profileId')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async getMyConnectedCardsWithProfileId(
    @Param('profileId') profileId: string,
    @Req() userRequest: RequestUser,
  ): Promise<CardResponse[]> {
    return await this.cardService.getMyConnectedCardWithProfileId(userRequest.user.id, profileId);
  }

  @Put('/public/add-connected-card')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async addConnectedCard(
    @Body() addConnectedCardRequest: AddConnectedCardRequest,
    @Req() userRequest: RequestUser,
  ): Promise<void> {
    return await this.cardService.addConnectedCardToMyCard(
      userRequest.user.id,
      addConnectedCardRequest.cardId,
      addConnectedCardRequest.connectedCardId,
    );
  }

  @Put('/public/remove-connected-card')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async removeConnectedCard(
    @Body() removeConnectedCard: RemoveConnectedCardRequest,
    @Req() userRequest: RequestUser,
  ): Promise<void> {
    return await this.cardService.removeConnectedCardFromMyCard(
      userRequest.user.id,
      removeConnectedCard.cardId,
      removeConnectedCard.connectedCardId,
    );
  }

  @Put('/admin/add-connected-card')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async addConnectedCardToCard(@Body() addConnectedCardRequest: AddConnectedCardRequest): Promise<void> {
    return await this.cardService.addConnectedCard(
      addConnectedCardRequest.cardId,
      addConnectedCardRequest.connectedCardId,
    );
  }

  @Put('/admin/remove-connected-card')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async removeConnectedCardFromCard(@Body() removeConnectedCard: RemoveConnectedCardRequest): Promise<void> {
    return await this.cardService.removeConnectedCard(removeConnectedCard.cardId, removeConnectedCard.connectedCardId);
  }

  @Put('/open/add-view-count/:cardId')
  @HttpCode(204)
  async addViewCount(@Param('cardId') cardId: string): Promise<void> {
    return await this.cardService.addViewCount(cardId);
  }

  @Put('/public/add-saved-card-to-my-card')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async addSavedCardToMyCard(
    @Body() addSavedCardRequest: AddSavedCardRequest,
    @Req() userRequest: RequestUser,
  ): Promise<void> {
    return await this.cardService.addSavedCardToMyCard(
      userRequest.user.id,
      addSavedCardRequest.cardId,
      addSavedCardRequest.profileId,
    );
  }

  @Put('/public/remove-saved-card-from-my-card')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async removeSavedCardFromMyCard(
    @Body() removeSavedCardRequest: RemoveSavedCardRequest,
    @Req() userRequest: RequestUser,
  ): Promise<void> {
    return await this.cardService.removeSavedCardFromMyCard(
      userRequest.user.id,
      removeSavedCardRequest.cardId,
      removeSavedCardRequest.profileId,
    );
  }

  @Post('/admin/create-card-admin/:profileId')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async createCard(@Param('profileId') profileId: string, @Body() createCardRequest: CreateCardRequest): Promise<void> {
    return await this.cardService.createCard(profileId, createCardRequest);
  }

  @Post('/public/create-card/:profileId')
  @HttpCode(201)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async createCardForMe(
    @Param('profileId') profileId: string,
    @Body() createCardRequest: CreateCardRequest,
    @Req() userRequest: RequestUser,
  ): Promise<void> {
    return await this.cardService.createCardForMe(userRequest.user.id, profileId, createCardRequest);
  }

  @Delete('/admin/delete-card/:cardId')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async deleteCard(@Param('cardId') cardId: string): Promise<void> {
    return await this.cardService.deleteCard(cardId);
  }

  @Delete('/public/delete-card/:cardId')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async deleteMyCard(@Param('cardId') cardId: string, @Req() userRequest: RequestUser): Promise<void> {
    return await this.cardService.softDeleteMyCard(userRequest.user.id, cardId);
  }

  @Delete('/admin/soft-delete-card/:cardId')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async softDeleteCard(@Param('cardId') cardId: string): Promise<void> {
    return await this.cardService.softDeleteCard(cardId);
  }

  @Put('/admin/restore-card/:cardId')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async restoreCard(@Param('cardId') cardId: string): Promise<void> {
    return await this.cardService.restoreCard(cardId);
  }

  @Put('/admin/update-card/:cardId')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async updateCard(@Param('cardId') cardId: string, @Body() updateCardRequest: UpdateCardRequest): Promise<void> {
    return await this.cardService.updateCard(cardId, updateCardRequest);
  }

  @Put('/public/update-my-card/:cardId')
  @HttpCode(204)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.PUBLIC]))
  async updateMyCard(
    @Param('cardId') cardId: string,
    @Body() updateCardRequest: UpdateCardRequest,
    @Req() userRequest: RequestUser,
  ): Promise<void> {
    return await this.cardService.updateMyCard(userRequest.user.id, cardId, updateCardRequest);
  }

  @Get('/admin/get-all-card-count')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async countAllCard(): Promise<number> {
    return await this.cardService.getAllCardCount();
  }
}
