import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { CanBeUndefined } from '../../utilities/can-be-undefined';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  text?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @CanBeUndefined()
  @IsNumber({}, { each: true })
  categoryIds?: number[];
}
