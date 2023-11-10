import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  text?: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}
