import { UserRoleEnum } from '../../user/domain/enum/user-role.enum';
import { CanActivate, ExecutionContext, Type, mixin, Injectable } from "@nestjs/common";
import { RequestUser } from '../interface/request-user.interface';
import JwtAuthenticationGuard from './jwt-auth.guard';
import { UserService } from '../../user/user.service';
import JwtRefreshGuard from "./jwt-refresh-token.guard";

export const RoleGuard = (roles: UserRoleEnum[]): Type<CanActivate> => {
  @Injectable()
  class RoleGuardMixin extends JwtRefreshGuard {
    constructor(private readonly userService: UserService) {
      super();
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<RequestUser>();
      const { user } = request;
      const userFromDb = await this.userService.findOne(user.id);
      return roles.some(role => userFromDb?.roles.includes(role));
    }
  }
  return mixin(RoleGuardMixin);
};
