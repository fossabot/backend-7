import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { GroceryItemsService } from './grocery-items.service';
import { CreateGroceryItemDto } from './dto/create-grocery-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/schemas/user.schema';
import { GroceryItem } from './interfaces/grocery-item.interface';

@Controller('grocery-items')
export class GroceryItemsController {
  constructor(private readonly groceryItemsService: GroceryItemsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createGroceryItemDto: CreateGroceryItemDto,
    @Req() req: Request,
  ): Promise<void> {
    const currentUser = req.user as User;
    await this.groceryItemsService.create(
      createGroceryItemDto,
      currentUser._id,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Req() req: Request): Promise<GroceryItem[]> {
    const currentUser = req.user as User;
    return this.groceryItemsService.findAllByUserId(currentUser._id);
  }
}
