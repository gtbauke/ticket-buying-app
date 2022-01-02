import { HttpStatus } from '@nestjs/common';

import { UserError, UserErrorKind } from './UserError';

export class EmailAlreadyInUseError extends UserError {
  public constructor(email: string) {
    super(
      UserErrorKind.EmailAlreadyInUser,
      HttpStatus.BAD_REQUEST,
      `The email ${email} is already in use`,
    );
  }
}
