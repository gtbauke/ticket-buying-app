import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  HttpException,
} from '@nestjs/common';

import { IRequestWithUser } from './utils/IRequestWithUser';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UsersService } from './users/users.service';
import { Either } from './utils/Either';

import { User } from '.prisma/client';

@Controller()
export class AppController {
  public constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  public async login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  public async me(@Request() req: IRequestWithUser) {
    const user = await this.usersService.findOne({ id: req.user.userId });

    if (Either.isLeft(user))
      throw new HttpException(user.value, user.value.statusCode);

    return { user: user.value };
  }
}
