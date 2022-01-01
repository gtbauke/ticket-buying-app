import { HttpStatus } from '@nestjs/common';

import { ApiError } from '../../utils/ApiError';

// eslint-disable-next-line no-shadow
export enum UserErrorKind {
  UserNotFound = 'UserNotFound',
  MissingEmail = 'MissingEmail',
  MissingPassword = 'MissingPassword',
}

export abstract class UserError extends ApiError {
  public readonly kind: UserErrorKind;

  public constructor(
    kind: UserErrorKind,
    statusCode: HttpStatus,
    message: string,
  ) {
    super(statusCode, message);
    this.kind = kind;
  }
}
