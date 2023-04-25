import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiMailService } from '../application/api-mail.service';
import { ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../../auth/web/guards/role.guard';
import { UserRoleEnum } from '../../user/domain/enum/user-role.enum';
import { MailDto } from '../domain/dto/mail.dto';

@Controller('api-mail')
@ApiTags('Mail')
export class ApiMailController {
  constructor(private readonly apiMailService: ApiMailService) {}

  @Post('/')
  @HttpCode(200)
  @UseGuards(RoleGuard([UserRoleEnum.ADMIN]))
  async sendMail(@Body() mailDto: MailDto): Promise<void> {
    await this.apiMailService.sendMail(mailDto);
  }
}
