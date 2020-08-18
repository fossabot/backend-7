import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GroceryItem } from './schemas/grocery-item.schema';
import { CreateGroceryItemDto } from './dto/create-grocery-item.dto';

@Injectable()
export class GroceryItemsService {
    constructor(@InjectModel(GroceryItem.name) private groceryItemModel: Model<GroceryItem>) { }

    async create(createGroceryItemDto: CreateGroceryItemDto): Promise<GroceryItem> {
        const createdGroceryItem = new this.groceryItemModel(createGroceryItemDto);
        return createdGroceryItem.save();
    }

    async findAll(): Promise<GroceryItem[]> {
        return this.groceryItemModel.find().exec();
    }
}
