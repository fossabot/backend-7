import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroceryItem } from './interfaces/grocery-item.interface';
import { GroceryItemDocument } from './interfaces/grocery-item-document.interface';
import { GroceryItemDto } from './dto/grocery-item.dto';

export interface DeleteResult {
  deleted: boolean;
  message?: string;
}

export interface IGroceryItemsService {
  createNew(
    groceryItemDto: GroceryItemDto,
    ownerId: string,
  ): Promise<GroceryItem>;
  updateOne(groceryItemDto: GroceryItemDto): Promise<GroceryItem>;
  getAllByOwnerId(ownerId: string): Promise<GroceryItem[]>;
  getOneById(id: string): Promise<GroceryItem>;
  deleteOne(id: string): Promise<DeleteResult>;
}

@Injectable()
export class GroceryItemsService implements IGroceryItemsService {
  constructor(
    @InjectModel('GroceryItem')
    private readonly groceryItemModel: Model<GroceryItemDocument>,
  ) {}

  async createNew(
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

  async updateOne(groceryItemDto: GroceryItemDto): Promise<GroceryItem> {
    const { _id } = groceryItemDto;
    this.groceryItemModel.update({ _id }, groceryItemDto);
    return this.getOneById(_id);
  }

  async getAllByOwnerId(userId: string): Promise<GroceryItem[]> {
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

  async getOneById(id: string): Promise<GroceryItem> {
    const groceryItem = await this.groceryItemModel.findOne({ _id: id }).exec();
    return {
      id: groceryItem._id,
      name: groceryItem.name,
      quantity: groceryItem.quantity,
      description: groceryItem.description,
    };
  }

  async deleteOne(id: string): Promise<DeleteResult> {
    try {
      await this.groceryItemModel.deleteOne({ _id: id });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
