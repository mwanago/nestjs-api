import { ConflictException } from '@nestjs/common';

export class SlugNotUniqueException extends ConflictException {
  constructor(slug: string) {
    super(`The ${slug} slug is not unique`);
  }
}
