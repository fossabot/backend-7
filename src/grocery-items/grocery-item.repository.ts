import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroceryItemDocument } from './interfaces/grocery-item-document.interface';

export interface IGroceryItemsRepository {
  findAllByOwnerId(ownerId: string): Promise<GroceryItemDocument[]>;
  findOneById(id: string): Promise<GroceryItemDocument>;
  save(groceryItem: GroceryItemDocument): Promise<GroceryItemDocument>;
  updateOneById(
    id: string,
    groceryItem: GroceryItemDocument,
  ): Promise<GroceryItemDocument>;
}

@Injectable()
export class GroceryItemsRepository implements IGroceryItemsRepository {
  constructor(
    @InjectModel('GroceryItem')
    private readonly groceryItemModel: Model<GroceryItemDocument>,
  ) {}
  async findAllByOwnerId(ownerId: string): Promise<GroceryItemDocument[]> {
    return await this.groceryItemModel.find({ userId: ownerId }).exec();
  }

  async findOneById(id: string): Promise<GroceryItemDocument> {
    return await this.groceryItemModel.findOne({ _id: id }).exec();
  }

  async save(groceryItem: GroceryItemDocument): Promise<GroceryItemDocument> {
    return await this.groceryItemModel.create(groceryItem);
  }

  async updateOneById(
    id: string,
    groceryItem: GroceryItemDocument,
  ): Promise<GroceryItemDocument> {
    return await this.groceryItemModel
      .updateOne({ _id: id }, groceryItem)
      .exec();
  }
}
