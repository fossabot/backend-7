import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroceryItem } from './interfaces/grocery-item.interface';
import { GroceryItemDocument } from './interfaces/grocery-item-document.interface';
import { GroceryItemDto } from './dto/grocery-item.dto';

@Injectable()
export class GroceryItemsService {
  constructor(
    @InjectModel('GroceryItem')
    private readonly groceryItemModel: Model<GroceryItemDocument>,
  ) {}

  async create(
    groceryItemDto: GroceryItemDto,
    ownerId: string,
  ): Promise<GroceryItem> {
    groceryItemDto.userId = ownerId;
    const createdGroceryItem = await this.groceryItemModel.create(
      groceryItemDto,
    );

    return {
      id: createdGroceryItem._id,
      name: createdGroceryItem.name,
      quantity: createdGroceryItem.quantity,
      description: createdGroceryItem.description,
    };
  }

  async findAllByUserId(userId: string): Promise<GroceryItem[]> {
    const groceryItems = await this.groceryItemModel
      .find({ userId }, { __v: 0, userId: 0 })
      .exec();
    return groceryItems.map((groceryItem) => ({
      id: groceryItem._id,
      name: groceryItem.name,
      quantity: groceryItem.quantity,
      description: groceryItem.description,
    }));
  }
}
