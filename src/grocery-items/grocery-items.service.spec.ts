import { Test, TestingModule } from '@nestjs/testing';
import { GroceryItemsService } from './grocery-items.service';
import { GroceryItemsRepository } from './grocery-item.repository';
import { GroceryItem } from './interfaces/grocery-item.interface';
import { IGroceryItemDocument } from './interfaces/igrocery-item-document.interface';
import { NotFoundException } from '@nestjs/common';

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
}) => Partial<IGroceryItemDocument> = (mock?: {
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
  let repository: GroceryItemsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroceryItemsService,
        {
          provide: GroceryItemsRepository,
          useValue: {
            createOne: jest.fn(),
            findOneById: jest.fn(),
            findAllByOwnerId: jest.fn(),
            updateOneById: jest.fn(),
            deleteOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GroceryItemsService>(GroceryItemsService);
    repository = module.get<GroceryItemsRepository>(GroceryItemsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all grocery items for root user', async () => {
    jest
      .spyOn(repository, 'findAllByOwnerId')
      .mockResolvedValue(groceryItemsDocArray as IGroceryItemDocument[]);
    const groceryItems = await service.getAllByOwnerId('root');
    expect(groceryItems).toEqual(groceryItemsArray);
  });
  it('should getOne by id', async () => {
    jest.spyOn(repository, 'findOneById').mockResolvedValue({
      name: 'Potato',
      _id: '123',
      quantity: 1,
      userId: 'root',
    });

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
    jest.spyOn(repository, 'createOne').mockResolvedValueOnce({
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
    jest.spyOn(repository, 'findOneById').mockResolvedValue({
      _id: '1',
      name: 'Potato',
      description: 'chips',
      quantity: 1.5,
      userId: 'root',
    });

    const updatedGroceryItem = await service.updateOne(
      {
        id: '1',
        name: 'Potato',
        description: 'chips',
        quantity: 1.5,
      },
      'root',
    );
    expect(updatedGroceryItem).toEqual(
      mockGroceryItem('Potato', '1', 'chips', 1.5),
    );
  });
  it('should delete a grocery item successfully', async () => {
    // jest.spyOn(repository, 'deleteOneById').mockClear();
    jest.spyOn(repository, 'findOneById').mockResolvedValue({
      _id: '1',
      name: 'Potato',
      description: 'chips',
      quantity: 1.5,
      userId: 'root',
    });

    expect(await service.deleteOne('1', 'root')).toEqual({
      deleted: true,
    });
  });
  it('should not delete a grocery item', async () => {
    // really just returning a falsy value here as we aren't doing any logic with the return
    jest.spyOn(repository, 'findOneById').mockResolvedValue(undefined);

    expect(() => service.deleteOne('a bad id', 'root')).rejects.toEqual(
      new NotFoundException("The record with given id doesn't exist"),
    );
  });
});
