import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { v4 as uuid } from 'uuid';

import { UsersService } from '../users.service';
import { Either } from '../../utils/Either';
import { EmailAlreadyInUseError } from '../errors/EmailAlreadyInUseError.error';
import { UserNotFoundError } from '../errors/UserNotFound.error';
import { PrismaService } from '../../global/prisma.service';

const userToCreate = {
  id: uuid(),
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
};

const userToUpdate = {
  id: uuid(),
  email: faker.internet.email(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  password: faker.internet.password(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
};

const users = [
  {
    id: uuid(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: `${faker.internet.password()}!`,
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
  {
    id: uuid(),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.internet.password(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  },
  userToUpdate,
];

const user = users[0];

const db = {
  user: {
    create: jest.fn().mockResolvedValue(userToCreate),
    update: jest.fn().mockResolvedValue(userToUpdate),
    findUnique: jest
      .fn()
      .mockImplementation(({ where: { id, email } }) =>
        users.find(u => u.id === id || u.email === email),
      ),
    findMany: jest.fn().mockResolvedValue(users),
    delete: jest.fn().mockResolvedValue(user),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PrismaService, useValue: db }, UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('when creating an user', () => {
    it('should return an EmailAlreadyInUseError when the using an already existing email', async () => {
      const result = await service.create({
        email: user.email,
        password: user.password,
      });

      expect(result).toEqual(
        Either.left(new EmailAlreadyInUseError(user.email)),
      );
    });

    it('should return the created user info', async () => {
      const result = await service.create({
        email: userToCreate.email,
        password: userToCreate.password,
        firstName: userToCreate.firstName,
        lastName: userToCreate.lastName,
      });

      expect(result).toEqual(Either.right(userToCreate));
    });
  });

  describe('when updating an user', () => {
    it('should return the updated user info', async () => {
      const result = await service.update(userToUpdate.id, {
        email: userToUpdate.email,
        firstName: userToUpdate.firstName,
        lastName: userToUpdate.lastName,
      });

      expect(result).toEqual(Either.right(userToUpdate));
    });

    it('should return the updated user info and rehash the password', async () => {
      const result = await service.update(userToUpdate.id, {
        email: userToUpdate.email,
        firstName: userToUpdate.firstName,
        lastName: userToUpdate.lastName,
        password: `${userToUpdate.password}!`,
      });

      expect(result).toEqual(Either.right(userToUpdate));
    });

    it('should return an UserNotFoundError when the user does not exist', async () => {
      const result = await service.update('hello-world', {
        email: userToUpdate.email,
        firstName: userToUpdate.firstName,
        lastName: userToUpdate.lastName,
      });

      expect(result).toEqual(Either.left(new UserNotFoundError()));
    });
  });

  describe('when retrieving an user', () => {
    it('should return the user', async () => {
      const result = await service.findOne({ id: user.id });

      expect(result).toEqual(Either.right(user));
    });

    it('should return a UserNotFoundError when the user is not found', async () => {
      const result = await service.findOne({ id: 'hello-world' });

      expect(result).toEqual(Either.left(new UserNotFoundError()));
    });
  });

  describe('when retieving all users', () => {
    it('should return all user records', async () => {
      const result = await service.findAll();

      expect(result).toStrictEqual(users);
    });
  });

  describe('when deleting an user', () => {
    it('should return an UserNotFoundError when the provided id is not found', async () => {
      const result = await service.remove('hello-world');

      expect(result).toEqual(Either.left(new UserNotFoundError()));
    });

    it('should return true when the user is succesfully deleted', async () => {
      const result = await service.remove(user.id);
      expect(result).toEqual(Either.right(true));
    });
  });
});
