import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [ArticlesModule, LoggerModule],
})
export class AppModule {}
