import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from './auth.service';
import { Either } from '../utils/Either';

import { User } from '.prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  public async validate(email: string, password: string): Promise<User> {
    const isValid = await this.authService.isValidUser(email, password);

    if (Either.isLeft(isValid)) throw new UnauthorizedException();
    return isValid.value;
  }
}
