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
import { User } from '../users/interfaces/user.interface';
import { GroceryItemDto } from './dto/grocery-item.dto';

//TODO Introduce object converters from and to user
@Controller('grocery-items')
export class GroceryItemsController {
  constructor(private readonly groceryItemsService: GroceryItemsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createGroceryItemDto: CreateGroceryItemDto,
    @Req() req: Request,
  ): Promise<GroceryItemDto> {
    const currentUser = req.user as User;
    const createdGroceryItem = await this.groceryItemsService.createNew(
      createGroceryItemDto,
      currentUser._id,
    );
    return {
      id: createdGroceryItem._id,
      name: createdGroceryItem.name,
      quantity: createdGroceryItem.quantity,
      description: createdGroceryItem.description,
      unit: createdGroceryItem.unit,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Req() req: Request): Promise<GroceryItemDto[]> {
    const currentUser = req.user as User;
    const groceryItems = await this.groceryItemsService.getAllByOwnerId(
      currentUser._id,
    );
    return groceryItems.map((groceryItem) => ({
      id: groceryItem._id,
      name: groceryItem.name,
      quantity: groceryItem.quantity,
      description: groceryItem.description,
      unit: groceryItem.unit,
    }));
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getById(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<GroceryItemDto> {
    const currentUser = req.user as User;
    const groceryItem = await this.groceryItemsService.getOneById(
      id,
      currentUser._id,
    );
    return {
      id: groceryItem._id,
      name: groceryItem.name,
      quantity: groceryItem.quantity,
      description: groceryItem.description,
      unit: groceryItem.unit,
    };
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() groceryItem: GroceryItemDto,
    @Req() req: Request,
  ): Promise<GroceryItemDto> {
    const currentUser = req.user as User;
    const updatedGroceryItem = await this.groceryItemsService.updateOne(
      groceryItem,
      currentUser._id,
    );
    return {
      id: updatedGroceryItem._id,
      name: updatedGroceryItem.name,
      quantity: updatedGroceryItem.quantity,
      description: updatedGroceryItem.description,
      unit: updatedGroceryItem.unit,
    };
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
