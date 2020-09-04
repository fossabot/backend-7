import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGroceryItemDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;

  @IsString()
  readonly description?: string;
}
