import { Test, TestingModule } from '@nestjs/testing';
import { GroceryItemsService } from './grocery-items.service';
import { getModelToken } from '@nestjs/mongoose';
import { GroceryItem } from './interfaces/grocery-item.interface';
import { createMock } from '@golevelup/nestjs-testing';
import { DocumentQuery, Model } from 'mongoose';
import { GroceryItemDocument } from './interfaces/grocery-item-document.interface';

const mockGroceryItem: (
  name?: string,
  id?: string,
  description?: string,
  quantity?: number,
  userId?: string,
) => GroceryItem = (name, id, description, quantity, userId) => {
  return {
    name,
    id,
    description,
    quantity,
    userId,
  };
};

const mockGroceryItemDocument: (mock?: {
  name?: string;
  id?: string;
  description?: string;
  quantity?: number;
  userId?: string;
}) => Partial<GroceryItemDocument> = (mock?: {
  name: string;
  id: string;
  description: string;
  quantity: number;
  userId: string;
}) => {
    return {
      name: mock.name,
      _id: mock.id,
      description: mock.description,
      quantity: mock.quantity,
      userId: mock.userId,
    };
  };

const groceryItemsArray: GroceryItem[] = [
  mockGroceryItem('Potato', '1', 'nice tomato', 1, undefined),
  mockGroceryItem('Egg', '2', 'boiled egg', 2, undefined),
  mockGroceryItem('Milk', '3', 'mmmmmilk', 3, undefined),
];

const groceryItemsDocArray = [
  mockGroceryItemDocument({
    name: 'Potato',
    id: '1',
    description: 'nice tomato',
    quantity: 1,
    userId: 'root',
  }),
  mockGroceryItemDocument({
    name: 'Egg',
    id: '2',
    description: 'boiled egg',
    quantity: 2,
    userId: 'root',
  }),
  mockGroceryItemDocument({
    name: 'Milk',
    id: '3',
    description: 'mmmmmilk',
    quantity: 3,
    userId: 'root',
  }),
];

describe('GroceryItemService', () => {
  let service: GroceryItemsService;
  let model: Model<GroceryItemDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroceryItemsService,
        {
          provide: getModelToken('GroceryItem'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockGroceryItem()),
            constructor: jest.fn().mockResolvedValue(mockGroceryItem()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            updateOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            deleteOne: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GroceryItemsService>(GroceryItemsService);
    model = module.get<Model<GroceryItemDocument>>(
      getModelToken('GroceryItem'),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all grocery items for root user', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(groceryItemsDocArray),
    } as any);
    const groceryItems = await service.getAllByOwnerId('root');
    expect(groceryItems).toEqual(groceryItemsArray);
  });
  it('should getOne by id', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<
        DocumentQuery<GroceryItemDocument, GroceryItemDocument, unknown>
      >({
        exec: jest.fn().mockResolvedValueOnce(
          mockGroceryItemDocument({
            name: 'Potato',
            id: '123',
            quantity: 1,
            userId: 'root',
          }),
        ),
      }),
    );
    const findMockGroceryItem = mockGroceryItem(
      'Potato',
      '123',
      undefined,
      1,
      undefined,
    );
    const foundGroceryItem = await service.getOneById('123', 'root');
    expect(foundGroceryItem).toEqual(findMockGroceryItem);
  });
  it('should insert a new grocery item', async () => {
    jest.spyOn(model, 'create').mockResolvedValueOnce({
      _id: '1',
      name: 'Potato',
      quantity: 1,
      description: 'can make chips out of it',
      userId: 'user',
    } as any); // dreaded as any, but it can't be helped
    const newCat = await service.createNew(
      {
        name: 'Potato',
        quantity: 1,
        description: 'can make chips out of it',
      },
      'user',
    );
    expect(newCat).toEqual(
      mockGroceryItem('Potato', '1', 'can make chips out of it', 1, undefined),
    );
  });
  it('should update a grocery item successfully', async () => {
    jest.spyOn(model, 'updateOne').mockResolvedValueOnce(true);
    jest.spyOn(model, 'findOne').mockResolvedValueOnce(
      createMock<
        DocumentQuery<GroceryItemDocument, GroceryItemDocument, unknown>
      >({
        exec: jest.fn().mockResolvedValueOnce({
          _id: '1',
          name: 'Potato',
          description: 'chips',
          quantity: 1.5,
          userId: 'root'
        }),
      }),
    )
    jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce(
      createMock<
        DocumentQuery<GroceryItemDocument, GroceryItemDocument, unknown>
      >({
        exec: jest.fn().mockResolvedValueOnce({
          _id: '1',
          name: 'Potato',
          description: 'chips',
          quantity: 1.5,
          userId: 'root'
        }),
      }),
    );
    const updatedGroceryItem = await service.updateOne({
      _id: '1',
      name: 'Potato',
      description: 'chips',
      quantity: 1.5,
    }, 'root');
    expect(updatedGroceryItem).toEqual(
      mockGroceryItem('Potato', '1', 'chips', 1.5),
    );
  });
  it('should delete a grocery item successfully', async () => {
    // really just returning a truthy value here as we aren't doing any logic with the return
    jest.spyOn(model, 'deleteOne').mockResolvedValueOnce(true as any);
    expect(await service.deleteOne('a good id', 'root')).toEqual({ deleted: true });
  });
  it('should not delete a grocery item', async () => {
    +
    // really just returning a falsy value here as we aren't doing any logic with the return
    jest.spyOn(model, 'deleteOne').mockRejectedValueOnce(new Error('Bad delete'));
    expect(await service.deleteOne('a bad id', 'root')).toEqual({
      deleted: false,
      message: 'Bad delete',
    });
  });
});
