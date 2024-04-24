import { Injectable, NotFoundException } from '@nestjs/common';
import { Article } from './article';
import { ArticleDto } from './article.dto';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class ArticlesService {
  constructor(private readonly loggerService: LoggerService) {}

  private nextCreatedArticleId = 1;
  private articles: Article[] = [];

  getAll() {
    this.loggerService.log('Getting a list of all articles');
    return this.articles;
  }

  getById(id: number) {
    this.loggerService.log('Getting the details of a single article');
    const article = this.articles.find((article) => article.id === id);
    if (article) {
      return article;
    }
    this.loggerService.warn('Trying to access an article that does not exist');
    throw new NotFoundException();
  }

  update(id: number, article: ArticleDto) {
    this.loggerService.log('Updating an article');
    const articleIndex = this.articles.findIndex(
      (article) => article.id === id,
    );
    if (articleIndex === -1) {
      this.loggerService.warn(
        'Trying to update an article that does not exist',
      );
      throw new NotFoundException();
    }
    this.articles[articleIndex] = {
      ...this.articles[articleIndex],
      title: article.title,
      content: article.content,
    };
    return article;
  }

  create(article: ArticleDto) {
    this.loggerService.log('Creating an article');
    const newArticle = {
      id: this.nextCreatedArticleId++,
      ...article,
    };
    this.articles.push(newArticle);
    return newArticle;
  }

  delete(id: number) {
    this.loggerService.warn('Deleting an article');
    const articleIndex = this.articles.findIndex(
      (article) => article.id === id,
    );
    if (articleIndex === -1) {
      this.loggerService.warn(
        'Trying to delete an article that does not exist',
      );
      throw new NotFoundException();
    }
    this.articles.splice(articleIndex, 1);
  }
}
