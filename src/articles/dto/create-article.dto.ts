import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

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
}
