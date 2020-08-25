import { Test } from '@nestjs/testing';
import { GroceryItemsController } from './grocery-items.controller';
import { GroceryItemsService } from './grocery-items.service';
import { GroceryItemDto } from './dto/grocery-item.dto';
import { createMock } from '@golevelup/nestjs-testing';
import { Request } from 'express';
import { CreateGroceryItemDto } from './dto/create-grocery-item.dto';


const mockRequestObject = () => {
  return createMock<Request>({ user: { _id: 'root' } });
};

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
      const groceryItems = await groceryItemsController.getAll(
        mockRequestObject(),
      );
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
      ]);
    });
  });
  describe('getById', () => {
    it('should return a single grocery item', async () => {
      expect(
        await groceryItemsController.getById('1', mockRequestObject()),
      ).toEqual({
        id: '1',
        userId: 'root',
        name: 'test',
        description: 'test',
        quantity: 1,
      });
      expect(
        await groceryItemsController.getById('2', mockRequestObject()),
      ).toEqual({
        id: '2',
        userId: 'root',
        name: 'test',
        description: 'test',
        quantity: 1,
      });
    });
  });
  describe('newGroceryItem', () => {
    it('should create a new cat', async () => {
      const newGroceryItemDto: CreateGroceryItemDto = {
        name: 'name',
        description: 'desc',
        quantity: 1,
      };
      const newlyCreatedGroceryItem = await groceryItemsController.create(
        newGroceryItemDto,
        mockRequestObject(),
      );

      expect(newlyCreatedGroceryItem).toEqual({
        id: 'a uuid',
        ...newGroceryItemDto,
      });
    });
  });
  describe('updateGroceryItem', () => {
    it('should update a new cat', async () => {
      const updatedGroceryItemDto: CreateGroceryItemDto = {
        name: 'name',
        description: 'desc',
        quantity: 1,
      };
      const newlyUpdatedGroceryItem = await groceryItemsController.update(
        updatedGroceryItemDto,
        mockRequestObject(),
      );

      expect(newlyUpdatedGroceryItem).toEqual({
        id: 'a uuid',
        ...updatedGroceryItemDto,
      });
    });
  });
  describe('deleteGroceryItem', () => {
    it('should return successful delete', async () => {
      expect(
        await groceryItemsController.delete('1', mockRequestObject()),
      ).toEqual({ deleted: true });
    });
    it('should return that id did not delete a grocery item', async () => {
      const deleteSpy = jest
        .spyOn(groceryItemsService, 'deleteOne')
        .mockResolvedValueOnce({ deleted: false });
      expect(
        await groceryItemsController.delete(
          'a uuid that does not exist',
          mockRequestObject(),
        ),
      ).toEqual({ deleted: false });
      expect(deleteSpy).toBeCalledWith('a uuid that does not exist', "root");
    });
  });
});
