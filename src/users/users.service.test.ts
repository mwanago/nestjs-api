import { UsersService } from './users.service';
import { Prisma, User } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserDto } from './user.dto';
import { PrismaError } from '../database/prisma-error.enum';

describe('The UsersService', () => {
  let usersService: UsersService;
  let findUniqueMock: jest.Mock;
  let createMock: jest.Mock;
  beforeEach(async () => {
    findUniqueMock = jest.fn();
    createMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: findUniqueMock,
              create: createMock,
            },
          },
        },
      ],
    }).compile();

    usersService = await module.get(UsersService);
  });
  describe('when the getById function is called', () => {
    describe('and the findUnique method returns the user', () => {
      let user: User;
      beforeEach(() => {
        user = {
          id: 1,
          email: 'john@smith.com',
          name: 'John',
          password: 'strongPassword123',
          addressId: null,
          phoneNumber: null,
        };
        findUniqueMock.mockResolvedValue(user);
      });
      it('should return the user', async () => {
        const result = await usersService.getById(user.id);
        expect(result).toBe(user);
      });
    });
    describe('and the findUnique method does not return the user', () => {
      beforeEach(() => {
        findUniqueMock.mockResolvedValue(undefined);
      });
      it('should throw the NotFoundException', async () => {
        return expect(async () => {
          await usersService.getById(1);
        }).rejects.toThrow(NotFoundException);
      });
    });
  });
  describe('when the create function is called with valid data', () => {
    let userData: UserDto;
    beforeEach(() => {
      userData = {
        email: 'john@smith.com',
        name: 'John',
        password: 'strongPassword123',
      };
    });
    describe('and the prismaService.create returns a valid user', () => {
      let user: User;
      beforeEach(() => {
        user = {
          email: 'john@smith.com',
          name: 'John',
          password: 'strongPassword123',
          id: 1,
          addressId: null,
          phoneNumber: null,
        };
        createMock.mockResolvedValue(user);
      });
      it('should return the created user', async () => {
        const result = await usersService.create(userData);
        expect(result).toBe(user);
      });
    });
    describe('and the prisma.create causes the UniqueConstraintViolated error', () => {
      beforeEach(() => {
        createMock.mockRejectedValue(
          new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
            code: PrismaError.UniqueConstraintViolated,
            clientVersion: Prisma.prismaVersion.client,
          }),
        );
      });
      it('should throw the ConflictException error', () => {
        return expect(async () => {
          await usersService.create(userData);
        }).rejects.toThrow(ConflictException);
      });
    });
  });
});
