import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { GroceryItemDto } from './dto/grocery-item.dto';
import { IGroceryItem } from './interfaces/igrocery-item.interface';
import { GroceryItemsRepository } from './grocery-item.repository';

export interface DeleteResult {
  deleted: boolean;
  message?: string;
}

export interface IGroceryItemsService {
  createNew(
    groceryItemDto: GroceryItemDto,
    ownerId: string,
  ): Promise<IGroceryItem>;
  updateOne(
    groceryItemDto: GroceryItemDto,
    currentUserId: string,
  ): Promise<IGroceryItem>;
  getAllByOwnerId(ownerId: string): Promise<IGroceryItem[]>;
  getOneById(id: string, currentUserId: string): Promise<IGroceryItem>;
  deleteOne(id: string, currentUserId: string): Promise<DeleteResult>;
}

@Injectable()
export class GroceryItemsService implements IGroceryItemsService {
  constructor(
    private readonly groceryItemsRepository: GroceryItemsRepository,
  ) {}

  async createNew(
    groceryItemDto: GroceryItemDto,
    ownerId: string,
  ): Promise<IGroceryItem> {
    groceryItemDto.userId = ownerId;

    const createdGroceryItem = await this.groceryItemsRepository.createOne(
      groceryItemDto,
    );

    return createdGroceryItem;
  }

  async updateOne(
    groceryItemDto: GroceryItemDto,
    currentUserId: string,
  ): Promise<IGroceryItem> {
    const { id } = groceryItemDto;

    const existingGroceryItem = await this.groceryItemsRepository.findOneById(
      id,
    );

    if (!existingGroceryItem) {
      throw new NotFoundException("The record with given id doesn't exist");
    }

    if (existingGroceryItem.userId.toString() !== currentUserId) {
      throw new ForbiddenException(
        "You don't have permission to access this object",
      );
    }

    await this.groceryItemsRepository.updateOneById(id, groceryItemDto);

    const groceryItem = await this.groceryItemsRepository.findOneById(id);

    return groceryItem;
  }

  async getAllByOwnerId(userId: string): Promise<IGroceryItem[]> {
    const groceryItems = await this.groceryItemsRepository.findAllByOwnerId(
      userId,
    );

    return groceryItems;
  }

  async getOneById(id: string, currentUserId: string): Promise<IGroceryItem> {
    const groceryItem = await this.groceryItemsRepository.findOneById(id);

    if (!groceryItem) {
      throw new NotFoundException("The record with given id doesn't exist");
    }

    if (groceryItem.userId.toString() !== currentUserId) {
      throw new ForbiddenException(
        "You don't have permission to access this object",
      );
    }

    return groceryItem;
  }

  async deleteOne(id: string, currentUserId: string): Promise<DeleteResult> {
    const existingGroceryItem = await this.groceryItemsRepository.findOneById(
      id,
    );

    if (!existingGroceryItem) {
      throw new NotFoundException("The record with given id doesn't exist");
    }

    if (existingGroceryItem.userId.toString() !== currentUserId) {
      throw new ForbiddenException(
        "You don't have permission to access this object",
      );
    }

    try {
      await this.groceryItemsRepository.deleteOneById(id);
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
