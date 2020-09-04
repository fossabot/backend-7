import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateGroceryItemDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
