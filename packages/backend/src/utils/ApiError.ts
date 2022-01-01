import { HttpStatus } from '@nestjs/common';

export abstract class ApiError {
  public readonly statusCode: HttpStatus;
  public readonly message: string;

  public constructor(statusCode: HttpStatus, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}
