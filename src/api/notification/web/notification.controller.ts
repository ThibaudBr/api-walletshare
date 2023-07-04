import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../../auth/web/guards/role.guard';
import { UserRoleEnum } from '../../user/domain/enum/user-role.enum';
import { NotificationResponse } from './response/notification.response';
import { RequestUser } from '../../auth/domain/interface/request-user.interface';
import { MarkNotificationAsReadRequest } from './request/mark-notification-as-read.request';
import { NotificationService } from '../application/notification.service';
import { CreateNotificationAdminRequest } from './request/create-notification-admin.request';
import { MarkNotificationsAsReadRequest } from './request/mark-notifications-as-read.request';

@Controller('notification')
@ApiTags('Notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/admin/get-all-notifications')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAllNotifications(): Promise<NotificationResponse[]> {
    return await this.notificationService.getAllNotifications();
  }

  @Get('/public/get-all-notifications-for-user')
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN, UserRoleEnum.COMPANY_ACCOUNT]))
  async getAllNotificationsForUser(@Req() req: RequestUser): Promise<NotificationResponse[]> {
    return await this.notificationService.getAllNotificationsForUser(req.user.id);
  }

  @Get('/public/get-unread-notifications-for-user')
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN, UserRoleEnum.COMPANY_ACCOUNT]))
  async getUnreadNotificationsForUser(@Req() req: RequestUser): Promise<NotificationResponse[]> {
    return await this.notificationService.getUnreadNotificationsForUser(req.user.id);
  }

  @Put('/public/mark-notification-as-read')
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN, UserRoleEnum.COMPANY_ACCOUNT]))
  async markNotificationAsRead(
    @Req() req: RequestUser,
    @Body() markNotificationAsReadRequest: MarkNotificationAsReadRequest,
  ): Promise<void> {
    return await this.notificationService.markNotificationAsRead(
      req.user.id,
      markNotificationAsReadRequest.notificationId,
    );
  }

  @Put('/public/mark-notification-as-read-tab')
  @UseGuards(RoleGuard([UserRoleEnum.PUBLIC, UserRoleEnum.ADMIN, UserRoleEnum.COMPANY_ACCOUNT]))
  async markNotificationAsReadTab(
    @Req() req: RequestUser,
    @Body() markNotificationAsReadRequest: MarkNotificationsAsReadRequest,
  ): Promise<void> {
    return await this.notificationService.markNotificationsAsRead(
      req.user.id,
      markNotificationAsReadRequest.notificationIds,
    );
  }

  @Delete('/admin/soft-remove-notification/:notificationId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async softRemoveNotification(@Param('notificationId') notificationId: string): Promise<void> {
    return await this.notificationService.softRemoveNotification(notificationId);
  }

  @Delete('/admin/remove-notification/:notificationId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async removeNotification(@Param('notificationId') notificationId: string): Promise<void> {
    return await this.notificationService.removeNotification(notificationId);
  }

  @Put('/admin/restore-notification/:notificationId')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async restoreNotification(@Param('notificationId') notificationId: string): Promise<void> {
    return await this.notificationService.restoreNotification(notificationId);
  }

  @Post('/admin/create-notification')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async createNotification(@Body() createNotificationAdminRequest: CreateNotificationAdminRequest): Promise<void> {
    return await this.notificationService.createNotificationAdmin(createNotificationAdminRequest);
  }

  @Get('/admin/get-all-unread-notification-count')
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAllUnreadNotification(): Promise<number> {
    return await this.notificationService.getAllUnreadNotificationCount();
  }
}
