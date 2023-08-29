import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleDto } from './article.dto';

@Controller('articles')
export default class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  getAll() {
    return this.articlesService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.getById(id);
  }

  @Post()
  create(@Body() article: ArticleDto) {
    return this.articlesService.create(article);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() article: ArticleDto) {
    return this.articlesService.update(id, article);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    this.articlesService.delete(id);
  }
}
