import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import * as Joi from 'joi';
import { CategoriesModule } from './categories/categories.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ArticlesModule,
    AuthenticationModule,
    CategoriesModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.number().required(),
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
