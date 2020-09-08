import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IGroceryItem } from './interfaces/igrocery-item.interface';
import { IGroceryItemDocument } from './interfaces/igrocery-item-document.interface';

export interface IGroceryItemsRepository {
  findAllByOwnerId(ownerId: string): Promise<IGroceryItem[]>;
  findOneById(id: string): Promise<IGroceryItem>;
  createOne(groceryItem: IGroceryItem): Promise<IGroceryItem>;
  updateOneById(id: string, groceryItem: IGroceryItem): Promise<IGroceryItem>;
  deleteOneById(id: string): Promise<void>;
}

@Injectable()
export class GroceryItemsRepository implements IGroceryItemsRepository {
  constructor(
    @InjectModel('GroceryItem')
    private readonly groceryItemModel: Model<IGroceryItemDocument>,
  ) {}

  async findAllByOwnerId(ownerId: string): Promise<IGroceryItem[]> {
    return await this.groceryItemModel.find({ userId: ownerId }).exec();
  }

  async findOneById(id: string): Promise<IGroceryItem> {
    return await this.groceryItemModel.findOne({ _id: id }).exec();
  }

  async createOne(groceryItem: IGroceryItem): Promise<IGroceryItem> {
    return await this.groceryItemModel.create(groceryItem);
  }

  async updateOneById(
    id: string,
    groceryItem: IGroceryItem,
  ): Promise<IGroceryItem> {
    return await this.groceryItemModel
      .updateOne({ _id: id }, groceryItem)
      .exec();
  }

  async deleteOneById(id: string): Promise<void> {
    await this.groceryItemModel.deleteOne({ _id: id }).exec();
  }
}
