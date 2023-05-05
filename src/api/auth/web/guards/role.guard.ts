import { UserRoleEnum } from '../../../user/domain/enum/user-role.enum';
import { CanActivate, ExecutionContext, Injectable, mixin, Type } from '@nestjs/common';
import { RequestUser } from '../../domain/interface/request-user.interface';
import { UserService } from '../../../user/application/user.service';
import JwtRefreshGuard from './jwt-refresh-token.guard';

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
      return roles.some(role => user?.roles.includes(role));
    }
  }

  return mixin(RoleGuardMixin);
};
