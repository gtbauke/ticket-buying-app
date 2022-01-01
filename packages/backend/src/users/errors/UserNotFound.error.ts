import { HttpStatus } from '@nestjs/common';

import { UserError, UserErrorKind } from './UserError';

export class UserNotFoundError extends UserError {
  public constructor() {
    super(
      UserErrorKind.UserNotFound,
      HttpStatus.NOT_FOUND,
      `User was not found`,
    );
  }
}
