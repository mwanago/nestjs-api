import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { CanBeUndefined } from '../../utilities/can-be-undefined';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  text?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @Transform(({ value, obj }) => {
    if (value) {
      return value;
    }
    const title: string = obj.title;
    return title.toLowerCase().replaceAll(' ', '-');
  })
  urlSlug: string;

  @CanBeUndefined()
  @IsNumber({}, { each: true })
  categoryIds?: number[];
}
