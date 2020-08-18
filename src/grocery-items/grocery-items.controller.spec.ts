import { Test } from '@nestjs/testing';
import { GroceryItemsController } from './grocery-items.controller';
import { GroceryItemsService } from './grocery-items.service';
import { getModelToken } from '@nestjs/mongoose';
import { GroceryItem } from './schemas/grocery-item.schema';

const groceryItem = <GroceryItem>{ name: 'test', description: '', quantity: 1 }

class GroceryItemModel {
  constructor(private data) { }
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn().mockResolvedValue([groceryItem]);
  static findOne = jest.fn().mockResolvedValue(groceryItem);
  static findOneAndUpdate = jest.fn().mockResolvedValue(groceryItem);
  static deleteOne = jest.fn().mockResolvedValue(true);
}

describe('GroceryItemsController', () => {
  let catsController: GroceryItemsController;
  let catsService: GroceryItemsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GroceryItemsController],
      providers: [GroceryItemsService,
        {
          provide: getModelToken('GroceryItem'),
          useValue: GroceryItemModel
        }],
    }).compile();

    catsService = moduleRef.get<GroceryItemsService>(GroceryItemsService);
    catsController = moduleRef.get<GroceryItemsController>(GroceryItemsController);
  });

  describe('getAll', () => {
    it('should return an array of grocery items', async () => {
      const result = [groceryItem];

      jest.spyOn(catsService, 'findAll').mockImplementation(async () => result);

      expect(await catsController.getAll()).toBe(result);
    });
  });
});