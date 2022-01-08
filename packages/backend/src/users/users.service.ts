import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { User, Prisma } from '.prisma/client';

import { CreateUserDto } from './dto/create-user.dto';
import { Either } from '../utils/Either';
import { UserError } from './errors/UserError';
import { UserNotFoundError } from './errors/UserNotFound.error';
import { EmailAlreadyInUseError } from './errors/EmailAlreadyInUseError.error';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../global/prisma.service';

@Injectable()
export class UsersService {
  public constructor(private readonly prisma: PrismaService) {}

  public async create(
    createUserDto: CreateUserDto,
  ): Promise<Either<User, UserError>> {
    const { firstName, lastName, email, password } = createUserDto;
    const isAlreadyPresent = !!(await this.prisma.user.findUnique({
      where: { email },
    }));

    if (isAlreadyPresent) {
      return Either.left(new EmailAlreadyInUseError(email));
    }

    const hashedPassword = await argon.hash(password);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName },
    });

    return Either.right(user);
  }

  public async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
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

  public async update(
    id: string,
    { email, password, firstName, lastName }: UpdateUserDto,
  ): Promise<Either<User, UserError>> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return Either.left(new UserNotFoundError());
    }

    const hash = password ? await argon.hash(password) : undefined;
    const updatedUser = await this.prisma.user.update({
      data: { email, password: hash, firstName, lastName },
      where: { id },
    });

    return Either.right(updatedUser);
  }

  public async remove(id: string): Promise<Either<boolean, UserError>> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return Either.left(new UserNotFoundError());
    }

    await this.prisma.user.delete({ where: { id } });
    return Either.right(true);
  }
}
