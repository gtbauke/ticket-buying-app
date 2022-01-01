import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { UsersService } from '../users/users.service';
import { Either } from '../utils/Either';

import { User } from '.prisma/client';

import { AccessToken } from '../utils/Token';

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async isValidUser(
    email: string,
    plainPassword: string,
  ): Promise<Either<User, boolean>> {
    const user = await this.usersService.findOne({ email });

    if (!Either.isRight(user)) return Either.left(false);

    const { password } = user.value;
    const isSamePassword = await argon.verify(password, plainPassword);

    if (!isSamePassword) return Either.left(false);
    return user;
  }

  public async login(user: User): Promise<{ token: AccessToken }> {
    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
