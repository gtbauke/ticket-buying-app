import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { User, Prisma } from '.prisma/client';

import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../Prisma.service';
import { Either } from '../utils/Either';
import { UserError, UserErrorKind } from './errors/UserError';
import { UserNotFoundError } from './errors/UserNotFound.error';
import { InvalidUserInputError } from './errors/InvalidUserInput.error';

@Injectable()
export class UsersService {
  public constructor(private readonly prisma: PrismaService) {}

  public async create({
    email,
    password,
    firstName,
    lastName,
  }: CreateUserDto): Promise<Either<{ user: User }, InvalidUserInputError>> {
    if (!email) {
      return Either.left(
        new InvalidUserInputError(
          UserErrorKind.MissingEmail,
          'Email is required',
        ),
      );
    }

    if (!password) {
      return Either.left(
        new InvalidUserInputError(
          UserErrorKind.MissingPassword,
          'Password is required',
        ),
      );
    }

    const hashedPassword = await argon.hash(password);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName },
    });

    return Either.right({ user });
  }

  public findAll() {
    return `This action returns all users`;
  }

  public async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<Either<User, UserError>> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });

    if (!user) return Either.left(new UserNotFoundError());
    return Either.right(user);
  }

  // public update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  public remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
