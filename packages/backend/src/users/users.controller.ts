import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

import { Either } from '../utils/Either';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { User } from '.prisma/client';

import { UpdateUserDto } from './dto/update-user.dto';
import { IRequestWithUser } from '../utils/IRequestWithUser';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    if (Either.isLeft(user))
      throw new HttpException(user.value, user.value.statusCode);

    return { user: user.value };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  public async findAll(): Promise<{ users: User[] }> {
    const users = await this.usersService.findAll();
    return { users };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne({ id });

    if (Either.isLeft(user)) {
      throw new HttpException(user.value, user.value.statusCode);
    }

    return { user: user.value };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  public async update(
    @Req() request: IRequestWithUser,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (request.user.userId !== id) {
      throw new UnauthorizedException();
    }

    const updatedUser = await this.usersService.update(id, updateUserDto);

    if (Either.isLeft(updatedUser)) {
      throw new HttpException(updatedUser.value, updatedUser.value.statusCode);
    }

    return { user: updatedUser.value };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(
    @Req() request: IRequestWithUser,
    @Param('id') id: string,
  ) {
    if (request.user.userId !== id) {
      throw new UnauthorizedException();
    }

    const statusOperation = await this.usersService.remove(id);

    if (Either.isLeft(statusOperation)) {
      throw new HttpException(
        statusOperation.value,
        statusOperation.value.statusCode,
      );
    }
  }
}
