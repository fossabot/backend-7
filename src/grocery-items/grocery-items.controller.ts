import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { GroceryItemsService, DeleteResult } from './grocery-items.service';
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
  ): Promise<GroceryItem> {
    const currentUser = req.user as User;
    return await this.groceryItemsService.createNew(
      createGroceryItemDto,
      currentUser._id,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Req() req: Request): Promise<GroceryItem[]> {
    const currentUser = req.user as User;
    return this.groceryItemsService.getAllByOwnerId(currentUser._id);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getById(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<GroceryItem> {
    const currentUser = req.user as User;
    return this.groceryItemsService.getOneById(id, currentUser._id);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() groceryItem: GroceryItem,
    @Req() req: Request,
  ): Promise<GroceryItem> {
    const currentUser = req.user as User;
    return this.groceryItemsService.updateOne(groceryItem, currentUser._id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<DeleteResult> {
    const currentUser = req.user as User;
    return this.groceryItemsService.deleteOne(id, currentUser._id);
  }
}
