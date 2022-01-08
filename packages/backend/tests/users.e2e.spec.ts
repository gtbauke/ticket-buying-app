/* eslint-disable jest/expect-expect */
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as faker from 'faker';

import { AppModule } from '../src/app.module';
import { TransformInterceptor } from '../src/transform.interceptor';
import { PrismaService } from '../src/Prisma.service';

describe('Users', () => {
  jest.setTimeout(10000);

  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new TransformInterceptor());

    prisma = moduleRef.get(PrismaService);
    await app.init();
  });

  describe('POST /users', () => {
    describe('when the email is invalid', () => {
      it('should return an error if no email is provided', async () => {
        const { body } = await request(app.getHttpServer())
          .post('/users')
          .send({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            password: `${faker.internet.password()}!`,
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(body).toEqual(
          expect.objectContaining({
            message: expect.arrayContaining([
              expect.stringContaining('Email is required'),
            ]),
            statusCode: HttpStatus.BAD_REQUEST,
          }),
        );
      });

      it('should return an error if the email is not a valid email address', async () => {
        const { body } = await request(app.getHttpServer())
          .post('/users')
          .send({
            email: 'this-is-not-an-email',
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            password: `${faker.internet.password()}!`,
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(body).toEqual(
          expect.objectContaining({
            message: expect.arrayContaining([
              expect.stringContaining('email must be an email'),
            ]),
            statusCode: HttpStatus.BAD_REQUEST,
          }),
        );
      });
    });

    describe('when the password is invalid', () => {
      it('should return an error if no password is provided', async () => {
        const { body } = await request(app.getHttpServer())
          .post('/users')
          .send({
            email: faker.internet.email(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(body).toEqual(
          expect.objectContaining({
            message: expect.arrayContaining([
              expect.stringContaining('Password is required'),
            ]),
            statusCode: HttpStatus.BAD_REQUEST,
          }),
        );
      });

      it('should return an error if the password is too short', async () => {
        const { body } = await request(app.getHttpServer())
          .post('/users')
          .send({
            email: faker.internet.email(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            password: 'short',
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(body).toEqual(
          expect.objectContaining({
            message: expect.arrayContaining([
              expect.stringContaining(
                'Password must be at least 8 characters long',
              ),
            ]),
            statusCode: HttpStatus.BAD_REQUEST,
          }),
        );
      });

      it('should return an error if the password is too long', async () => {
        const { body } = await request(app.getHttpServer())
          .post('/users')
          .send({
            email: faker.internet.email(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            password: faker.internet.password(256),
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(body).toEqual(
          expect.objectContaining({
            message: expect.arrayContaining([
              expect.stringContaining(
                'Password must be at most 255 characters long',
              ),
            ]),
            statusCode: HttpStatus.BAD_REQUEST,
          }),
        );
      });

      it('should return an error if the password does not contain a number', async () => {
        const { body } = await request(app.getHttpServer())
          .post('/users')
          .send({
            email: faker.internet.email(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            password: 'Password!',
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(body).toEqual(
          expect.objectContaining({
            message: expect.arrayContaining([
              expect.stringContaining(
                'Password must contain at least one number',
              ),
            ]),
            statusCode: HttpStatus.BAD_REQUEST,
          }),
        );
      });

      it('should return an error if the password does not contain a special character', async () => {
        const { body } = await request(app.getHttpServer())
          .post('/users')
          .send({
            email: faker.internet.email(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            password: 'Password123',
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(body).toEqual(
          expect.objectContaining({
            message: expect.arrayContaining([
              expect.stringContaining(
                'Password must contain at least one special character',
              ),
            ]),
            statusCode: HttpStatus.BAD_REQUEST,
          }),
        );
      });

      it('should return an error if the password does not contain an uppercase character', async () => {
        const { body } = await request(app.getHttpServer())
          .post('/users')
          .send({
            email: faker.internet.email(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            password: 'password123!',
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(body).toEqual(
          expect.objectContaining({
            message: expect.arrayContaining([
              expect.stringContaining(
                'Password must contain at least one uppercase character',
              ),
            ]),
            statusCode: HttpStatus.BAD_REQUEST,
          }),
        );
      });

      it('should return an error if the password does not contain a lowercase character', async () => {
        const { body } = await request(app.getHttpServer())
          .post('/users')
          .send({
            email: faker.internet.email(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            password: 'PASSWORD123!',
          })
          .expect(HttpStatus.BAD_REQUEST);

        expect(body).toEqual(
          expect.objectContaining({
            message: expect.arrayContaining([
              expect.stringContaining(
                'Password must contain at least one lowercase character',
              ),
            ]),
            statusCode: HttpStatus.BAD_REQUEST,
          }),
        );
      });
    });

    describe('when all data is valid', () => {
      it('should return the created user', async () => {
        const userData = {
          email: faker.internet.email(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          password: `${faker.internet.password(10)}!`,
        };

        const { body } = await request(app.getHttpServer())
          .post('/users')
          .send(userData)
          .expect(HttpStatus.CREATED);

        expect(body).toEqual({
          data: {
            user: expect.objectContaining({
              id: expect.any(String),
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          },
        });
      });
    });
  });

  afterAll(async () => {
    await prisma.truncateAll();
    await app.close();
  });
});
