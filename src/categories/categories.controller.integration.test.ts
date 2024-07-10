import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { Category } from '@prisma/client';
import * as request from 'supertest';
import CategoriesController from './categories.controller';
import { CategoriesService } from './categories.service';

describe('The CategoriesController', () => {
  let app: INestApplication;
  let findManyMock: jest.Mock;
  beforeEach(async () => {
    findManyMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: {
            category: {
              findMany: findManyMock,
            },
          },
        },
      ],
      controllers: [CategoriesController],
      imports: [],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });
  describe('when the GET /categories endpoint is called', () => {
    let categories: Category[];
    beforeEach(() => {
      categories = [
        {
          id: 1,
          name: 'First category',
        },
        {
          id: 1,
          name: 'Second category',
        },
      ];
      findManyMock.mockResolvedValue(categories);
    });
    it('should return all categories', () => {
      return request(app.getHttpServer()).get('/categories').expect(categories);
    });
  });
});
