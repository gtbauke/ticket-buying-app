import { HttpStatus } from '@nestjs/common';

import { UserError, UserErrorKind } from './UserError';

export class InvalidUserInputError extends UserError {
  public constructor(kind: UserErrorKind, message: string) {
    super(kind, HttpStatus.BAD_REQUEST, message);
  }
}
