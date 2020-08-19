/**
 * You'll note that in a lot of this test class we use `to any`
 * rather liberally. Normally I'd be against this, but I don't
 * really want to mock all 59 fields **and** the ones we have
 * defined for our model, so instead we add an `as any` and
 * make those errors magically go away. In all seriousness
 * you may want to use some sort of base file elsewhere that
 * contains all the basic mock fields so you can take that
 * and add your fields on top. Seriously, 59 plus fields is a lot.
 */

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
  mockGroceryItem('Ventus', 'a uuid', 'desc', 1, 'root'),
  mockGroceryItem('Vitani', 'a new uuid', '2', 2, 'root'),
  mockGroceryItem('Simba', 'the king', '14', 3, 'root'),
];

const catDocArray = [
  mockGroceryItemDocument({
    name: 'Ventus',
    id: 'a uuid',
    description: 'desc',
    quantity: 1,
    userId: 'root',
  }),
  mockGroceryItemDocument({
    name: 'Vitani',
    id: 'a new uuid',
    description: '2',
    quantity: 2,
    userId: 'root',
  }),
  mockGroceryItemDocument({
    name: 'Simba',
    id: 'the king',
    description: '14',
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
            create: jest.fn(),
            remove: jest.fn(),
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
      exec: jest.fn().mockResolvedValueOnce(catDocArray),
    } as any);
    const cats = await service.findAllByUserId('root');
    expect(cats).toEqual([
      mockGroceryItem('Ventus', 'a uuid', 'desc', 1, undefined),
      mockGroceryItem('Vitani', 'a new uuid', '2', 2, undefined),
      mockGroceryItem('Simba', 'the king', '14', 3, undefined),
    ]);
  });
  //   it('should getOne by id', async () => {
  //     jest.spyOn(model, 'findOne').mockReturnValueOnce(
  //       createMock<DocumentQuery<CatDoc, CatDoc, unknown>>({
  //         exec: jest
  //           .fn()
  //           .mockResolvedValueOnce(mockCatDoc({ name: 'Ventus', id: 'an id' })),
  //       }),
  //     );
  //     const findMockCat = mockGroceryItem('Ventus', 'an id');
  //     const foundCat = await service.getOne('an id');
  //     expect(foundCat).toEqual(findMockCat);
  //   });
  //   it('should getOne by name', async () => {
  //     jest.spyOn(model, 'findOne').mockReturnValueOnce(
  //       createMock<DocumentQuery<CatDoc, CatDoc, unknown>>({
  //         exec: jest
  //           .fn()
  //           .mockResolvedValueOnce(
  //             mockCatDoc({ name: 'Mufasa', id: 'the dead king' }),
  //           ),
  //       }),
  //     );
  //     const findMockCat = mockGroceryItem('Mufasa', 'the dead king');
  //     const foundCat = await service.getOneByName('Mufasa');
  //     expect(foundCat).toEqual(findMockCat);
  //   });
  it('should insert a new cat', async () => {
    jest.spyOn(model, 'create').mockResolvedValueOnce({
      _id: 'some id',
      name: 'Oliver',
      quantity: 1,
      description: 'Tabby',
      userId: 'user',
    } as any); // dreaded as any, but it can't be helped
    const newCat = await service.create(
      {
        name: 'Oliver',
        quantity: 1,
        description: 'Tabby',
      },
      'user',
    );
    expect(newCat).toEqual(
      mockGroceryItem('Oliver', 'some id', 'Tabby', 1, undefined),
    );
  });
  //   it('should update a cat successfully', async () => {
  //     jest.spyOn(model, 'update').mockResolvedValueOnce(true);
  //     jest.spyOn(model, 'findOne').mockReturnValueOnce(
  //       createMock<DocumentQuery<CatDoc, CatDoc, unknown>>({
  //         exec: jest.fn().mockResolvedValueOnce({
  //           _id: lasagna,
  //           name: 'Garfield',
  //           breed: 'Tabby',
  //           age: 42,
  //         }),
  //       }),
  //     );
  //     const updatedCat = await service.updateOne({
  //       _id: lasagna,
  //       name: 'Garfield',
  //       breed: 'Tabby',
  //       age: 42,
  //     });
  //     expect(updatedCat).toEqual(
  //       mockGroceryItem('Garfield', lasagna, 42, 'Tabby'),
  //     );
  //   });
  //   it('should delete a cat successfully', async () => {
  //     // really just returning a truthy value here as we aren't doing any logic with the return
  //     jest.spyOn(model, 'remove').mockResolvedValueOnce(true as any);
  //     expect(await service.deleteOne('a bad id')).toEqual({ deleted: true });
  //   });
  //   it('should not delete a cat', async () => {
  //     // really just returning a falsy value here as we aren't doing any logic with the return
  //     jest.spyOn(model, 'remove').mockRejectedValueOnce(new Error('Bad delete'));
  //     expect(await service.deleteOne('a bad id')).toEqual({
  //       deleted: false,
  //       message: 'Bad delete',
  //     });
  //   });
});
