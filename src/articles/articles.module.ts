import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import ArticlesController from './articles.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
