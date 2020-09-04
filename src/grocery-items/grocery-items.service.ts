import { Model } from 'mongoose';
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
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
  updateOne(
    groceryItemDto: GroceryItemDto,
    currentUserId: string,
  ): Promise<GroceryItem>;
  getAllByOwnerId(ownerId: string): Promise<GroceryItem[]>;
  getOneById(id: string, currentUserId: string): Promise<GroceryItem>;
  deleteOne(id: string, currentUserId: string): Promise<DeleteResult>;
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
      unit: createdGroceryItem.unit
    };
  }

  async updateOne(
    groceryItemDto: GroceryItem,
    currentUserId: string,
  ): Promise<GroceryItem> {
    const { id } = groceryItemDto;

    const existingGroceryItem = await this.groceryItemModel
      .findOne({ _id: id })
      .exec();

    if (!existingGroceryItem) {
      throw new NotFoundException("The record with given id doesn't exist");
    }

    if (existingGroceryItem.userId.toString() !== currentUserId) {
      throw new ForbiddenException(
        "You don't have permission to access this object",
      );
    }

    await this.groceryItemModel.updateOne({ _id: id }, groceryItemDto).exec();

    const groceryItem = await this.groceryItemModel.findOne({ _id: id }).exec();

    return {
      id: groceryItem._id,
      name: groceryItem.name,
      quantity: groceryItem.quantity,
      description: groceryItem.description,
      unit: groceryItem.unit
    };
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
      unit: groceryItem.unit
    }));
  }

  async getOneById(id: string, currentUserId: string): Promise<GroceryItem> {
    const groceryItem = await this.groceryItemModel.findOne({ _id: id }).exec();

    if (!groceryItem) {
      throw new NotFoundException("The record with given id doesn't exist");
    }

    if (groceryItem.userId.toString() !== currentUserId) {
      throw new ForbiddenException(
        "You don't have permission to access this object",
      );
    }

    return {
      id: groceryItem._id,
      name: groceryItem.name,
      quantity: groceryItem.quantity,
      description: groceryItem.description,
      unit: groceryItem.unit
    };
  }

  async deleteOne(id: string, currentUserId: string): Promise<DeleteResult> {
    const existingGroceryItem = await this.groceryItemModel
      .findOne({ _id: id })
      .exec();

    if (!existingGroceryItem) {
      throw new NotFoundException("The record with given id doesn't exist");
    }

    if (existingGroceryItem.userId.toString() !== currentUserId) {
      throw new ForbiddenException(
        "You don't have permission to access this object",
      );
    }

    try {
      await this.groceryItemModel.deleteOne({ _id: id }).exec();
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
