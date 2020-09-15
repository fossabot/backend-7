import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { GroceryItemDto } from './dto/grocery-item.dto';
import { GroceryItem } from './interfaces/grocery-item.interface';
import { GroceryItemsRepository } from './grocery-items.repository';

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
    private readonly groceryItemsRepository: GroceryItemsRepository,
  ) {}

  async createNew(
    groceryItemDto: GroceryItemDto,
    ownerId: string,
  ): Promise<GroceryItem> {
    groceryItemDto.userId = ownerId;

    const createdGroceryItem = await this.groceryItemsRepository.createOne(
      groceryItemDto,
    );

    return createdGroceryItem;
  }

  async updateOne(
    groceryItemDto: GroceryItemDto,
    currentUserId: string,
  ): Promise<GroceryItem> {
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

  async getAllByOwnerId(userId: string): Promise<GroceryItem[]> {
    const groceryItems = await this.groceryItemsRepository.findAllByOwnerId(
      userId,
    );

    return groceryItems;
  }

  async getOneById(id: string, currentUserId: string): Promise<GroceryItem> {
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
