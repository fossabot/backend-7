import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GroceryItemsService } from './grocery-items.service';
import { CreateGroceryItemDto } from './dto/create-grocery-item.dto';
import { GroceryItem } from './schemas/grocery-item.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('grocery-items')
export class GroceryItemsController {
    constructor(private readonly groceryItemsService: GroceryItemsService) { }
    
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() createGroceryItemDto: CreateGroceryItemDto) {
        await this.groceryItemsService.create(createGroceryItemDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAll(): Promise<GroceryItem[]> {
        //TODO https://docs.nestjs.com/techniques/serialization
        //Don't return not wanted fields
        
        return this.groceryItemsService.findAll();
    }
}