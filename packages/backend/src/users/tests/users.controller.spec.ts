import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import * as faker from 'faker';
import { HttpException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { Either } from '../../utils/Either';
import { UserNotFoundError } from '../errors/UserNotFound.error';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

const users = [
  {
    id: uuid(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.internet.password(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  },
  {
    id: uuid(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.internet.password(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  },
  {
    id: uuid(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.internet.password(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  },
];

const user = {
  id: uuid(),
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: `${faker.internet.password()}!`,
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
};

// TODO: add tests for `update` and `remove`
describe('Users Controller', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(Either.right(user)),
            findAll: jest.fn().mockResolvedValue(users),
            findOne: jest
              .fn()
              .mockImplementation(
                ({ id, email }: { id: string; email: string }) => {
                  const targetUser = users.find(
                    u => u.id === id || u.email === email,
                  );

                  if (!targetUser) return Either.left(new UserNotFoundError());
                  return Either.right(targetUser);
                },
              ),
            update: jest
              .fn()
              .mockResolvedValue((id: string, dto: UpdateUserDto) => {
                const targetUser = users.find(u => u.id === id);

                if (!targetUser) return Either.left(new UserNotFoundError());
                return Either.right({
                  ...targetUser,
                  ...dto,
                });
              }),
            remove: jest.fn().mockResolvedValue((id: string) => {
              const targetUser = users.find(u => u.id === id);

              if (!targetUser) return Either.left(new UserNotFoundError());
              return Either.right(true);
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('when retrieving all users (findAll)', () => {
    it('should return all users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('when retrieving an user (findOne)', () => {
    it('should return a user', async () => {
      const result = await controller.findOne(users[0].id);
      expect(result).toEqual(users[0]);
    });

    it('should throw a HttpException when the user is not found', async () => {
      await expect(controller.findOne(uuid())).rejects.toThrow(HttpException);
    });
  });

  describe('when creating an user (create)', () => {
    it('should return the created user', async () => {
      const userDto: CreateUserDto = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
      };

      const result = await controller.create(userDto);
      expect(result).toEqual(user);
    });
  });
});
