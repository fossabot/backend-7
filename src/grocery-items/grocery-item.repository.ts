import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroceryItem } from './interfaces/grocery-item.interface';
import { GroceryItemDocument } from './interfaces/grocery-item-document.interface';

export interface IGroceryItemsRepository {
  findAllByOwnerId(ownerId: string): Promise<GroceryItem[]>;
  findOneById(id: string): Promise<GroceryItem>;
  createOne(groceryItem: GroceryItem): Promise<GroceryItem>;
  updateOneById(id: string, groceryItem: GroceryItem): Promise<GroceryItem>;
  deleteOneById(id: string): Promise<void>;
}

@Injectable()
export class GroceryItemsRepository implements IGroceryItemsRepository {
  constructor(
    @InjectModel('GroceryItem')
    private readonly groceryItemModel: Model<GroceryItemDocument>,
  ) {}

  async findAllByOwnerId(ownerId: string): Promise<GroceryItem[]> {
    return await this.groceryItemModel.find({ userId: ownerId }).exec();
  }

  async findOneById(id: string): Promise<GroceryItem> {
    return await this.groceryItemModel.findOne({ _id: id }).exec();
  }

  async createOne(groceryItem: GroceryItem): Promise<GroceryItem> {
    return await this.groceryItemModel.create(groceryItem);
  }

  async updateOneById(
    id: string,
    groceryItem: GroceryItem,
  ): Promise<GroceryItem> {
    return await this.groceryItemModel
      .updateOne({ _id: id }, groceryItem)
      .exec();
  }

  async deleteOneById(id: string): Promise<void> {
    await this.groceryItemModel.deleteOne({ _id: id }).exec();
  }
}
