import { Test } from '@nestjs/testing';
import { GroceryItemsController } from './grocery-items.controller';
import { GroceryItemsService } from './grocery-items.service';
import { getModelToken } from '@nestjs/mongoose';
import { GroceryItem } from './interfaces/grocery-item.interface';
import { GroceryItemDto } from './dto/grocery-item.dto';
import { createMock } from '@golevelup/nestjs-testing';
import { Request } from 'express'

const groceryItem = <GroceryItem>{ name: 'test', description: '', quantity: 1 };

const mockRequestObject = () => {
  return createMock<Request>({ user: { _id: 'root' } })
}

describe('GroceryItemsController', () => {
  let groceryItemsController: GroceryItemsController;
  let groceryItemsService: GroceryItemsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GroceryItemsController],
      providers: [
        {
          provide: GroceryItemsService,
          useValue: {
            createNew: jest
              .fn()
              .mockImplementation(
                (groceryItemDto: GroceryItemDto, ownerId: string) =>
                  Promise.resolve({ id: 'a uuid', ...groceryItemDto }),
              ),
            updateOne: jest
              .fn()
              .mockImplementation(
                (groceryItemDto: GroceryItemDto, currentUserId: string) =>
                  Promise.resolve({ id: 'a uuid', ...groceryItemDto }),
              ),
            getAllByOwnerId: jest.fn().mockImplementation((userId: string) =>
              Promise.resolve([
                {
                  id: '1',
                  name: 'test',
                  description: 'desc',
                  quantity: 1,
                  userId: userId,
                },
                {
                  id: '2',
                  name: 'test2',
                  description: 'desc2',
                  quantity: 1.5,
                  userId: userId,
                },
              ]),
            ),
            getOneById: jest
              .fn()
              .mockImplementation((id: string, currentUserId: string) =>
                Promise.resolve({
                  id,
                  userId: currentUserId,
                  name: 'test',
                  description: 'test',
                  quantity: 1,
                }),
              ),

            deleteOne: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    groceryItemsService = moduleRef.get<GroceryItemsService>(
      GroceryItemsService,
    );
    groceryItemsController = moduleRef.get<GroceryItemsController>(
      GroceryItemsController,
    );
  });

  it('should be defined', () => {
    expect(groceryItemsController).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of grocery items', async () => {
      const groceryItems = await groceryItemsController.getAll(mockRequestObject())
      expect(groceryItems).toEqual([
        {
          id: '1',
          name: 'test',
          description: 'desc',
          quantity: 1,
          userId: 'root',
        },
        {
          id: '2',
          name: 'test2',
          description: 'desc2',
          quantity: 1.5,
          userId: 'root',
        },
      ])
    });
  });
});
