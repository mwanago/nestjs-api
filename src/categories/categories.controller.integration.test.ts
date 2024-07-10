import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { Category } from '@prisma/client';
import * as request from 'supertest';
import CategoriesController from './categories.controller';
import { CategoriesService } from './categories.service';

describe('The CategoriesController', () => {
  let app: INestApplication;
  let findUniqueMock: jest.Mock;
  beforeEach(async () => {
    findUniqueMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: {
            category: {
              findUnique: findUniqueMock,
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
  describe('when the GET /categories/:id endpoint is called', () => {
    let category: Category;
    beforeEach(() => {
      category = {
        id: 1,
        name: 'My category',
      };
      findUniqueMock.mockImplementation((args: { where: { id: number } }) => {
        if (args.where.id === 1) {
          return Promise.resolve(category);
        }
        return Promise.resolve(undefined);
      });
    });
    describe('and the category with a given id exists', () => {
      it('should respond with the category', () => {
        return request(app.getHttpServer())
          .get('/categories/1')
          .expect(category);
      });
    });
    describe('and the category with a given id does not exist', () => {
      it('should respond with the 404 status', () => {
        return request(app.getHttpServer()).get('/categories/2').expect(404);
      });
    });
  });
});
