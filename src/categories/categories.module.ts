import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import CategoriesController from './categories.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
