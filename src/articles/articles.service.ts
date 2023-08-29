import { Injectable, NotFoundException } from '@nestjs/common';
import { Article } from './article';
import { ArticleDto } from './article.dto';

@Injectable()
export class ArticlesService {
  private lastArticleId = 0;
  private articles: Article[] = [];

  getAll() {
    return this.articles;
  }

  getById(id: number) {
    const article = this.articles.find((article) => article.id === id);
    if (article) {
      return article;
    }
    throw new NotFoundException();
  }

  update(id: number, article: ArticleDto) {
    const articleIndex = this.articles.findIndex(
      (article) => article.id === id,
    );
    if (articleIndex === -1) {
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
    const newArticle = {
      id: ++this.lastArticleId,
      ...article,
    };
    this.articles.push(newArticle);
    return newArticle;
  }

  delete(id: number) {
    const articleIndex = this.articles.findIndex(
      (article) => article.id === id,
    );
    if (articleIndex === -1) {
      throw new NotFoundException();
    }
    this.articles.splice(articleIndex, 1);
  }
}
