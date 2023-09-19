import { NotFoundException } from '@nestjs/common';

export class ArticleNotFoundException extends NotFoundException {
  constructor(articleId: number) {
    super(`Article with id ${articleId} not found`);
  }
}
