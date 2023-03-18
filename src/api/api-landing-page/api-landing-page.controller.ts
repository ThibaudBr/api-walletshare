import { Body, Controller, Delete, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiLandingPageService } from './api-landing-page.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MailResponse } from './domain/response/mail.response';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRoleEnum } from '../user/domain/enum/user-role.enum';

@Controller('api-landing-page')
@ApiTags('api-landing-page')
export class ApiLandingPageController {
  constructor(private readonly apiLandingPageService: ApiLandingPageService) {}

  @Get('/getAll')
  @ApiOperation({ summary: 'Get all mails' })
  @ApiOkResponse({ type: [MailResponse] })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async getAll(): Promise<MailResponse[]> {
    return this.apiLandingPageService.getAll();
  }

  @Delete('/delete-mail')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete mail' })
  @ApiOkResponse({ type: [MailResponse] })
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async deleteMail(@Body() mail: string): Promise<void> {
    return this.apiLandingPageService.deleteMail(mail);
  }
}
