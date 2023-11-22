import { IsString, IsNotEmpty } from 'class-validator';
import { CanBeUndefined } from '../../utilities/can-be-undefined';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @CanBeUndefined()
  name?: string;
}
