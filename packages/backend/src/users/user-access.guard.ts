import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { IRequestWithUser } from '../utils/IRequestWithUser';

type IRequestWithUsersAndParams = IRequestWithUser & { params: { id: string } };

@Injectable()
export class UserAccessGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user, params } = context
      .switchToHttp()
      .getRequest<IRequestWithUsersAndParams>();

    if (user.userId !== params.id) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
