import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { Category } from '@prisma/client';
import * as request from 'supertest';
import CategoriesController from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';

describe('The CategoriesController', () => {
  let app: INestApplication;
  let findUniqueMock: jest.Mock;
  let createMock: jest.Mock;
  beforeEach(async () => {
    findUniqueMock = jest.fn();
    createMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: {
            category: {
              findUnique: findUniqueMock,
              create: createMock,
            },
          },
        },
      ],
      controllers: [CategoriesController],
      imports: [],
    })
      .overrideGuard(JwtAuthenticationGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = {
            id: 1,
            name: 'John Smith',
          };
          return true;
        },
      })
      .compile();

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
  describe('and the POST /categories endpoint is called', () => {
    describe('and the correct data is provided', () => {
      let categoryData: CreateCategoryDto;
      beforeEach(() => {
        categoryData = {
          name: 'New category',
        };
        createMock.mockResolvedValue({
          id: 2,
          ...categoryData,
        });
      });
      it('should respond with the new category', () => {
        return request(app.getHttpServer())
          .post('/categories')
          .send(categoryData)
          .expect({
            id: 2,
            ...categoryData,
          });
      });
    });
  });
});
