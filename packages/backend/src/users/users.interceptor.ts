import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type IUserResponse<T> =
  | {
      users: T[];
    }
  | { user: T };

@Injectable()
export class UsersInterceptor<T>
  implements NestInterceptor<T, IUserResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IUserResponse<T>> {
    return next
      .handle()
      .pipe(
        map(data => (Array.isArray(data) ? { users: data } : { user: data })),
      );
  }
}
