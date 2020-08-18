
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGroceryItemDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsNumber()
    readonly quantity: number;

    @IsNotEmpty()
    @IsString()
    readonly description: string;
}