import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { v4 as uuidv4 } from 'uuid';

describe('App (e2e)', () => {
  let app: INestApplication;
  let access_token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GroceryItemsModule', () => {
    //create new user and get access token
    beforeAll(async () => {
      const user = {
        email: `jest-${uuidv4()}@e2e.com`,
        password: 'test',
        name: 'e2e',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(user)
        .expect(201);

      const accessToken = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(200);

      access_token = accessToken.body.access_token;
    });

    // small script to remove all database entries for grocery items between tests
    beforeEach(async () => {
      const uncleared = await request(app.getHttpServer())
        .get('/grocery-items')
        .set('Authorization', 'Bearer ' + access_token);
      await Promise.all(
        uncleared.body.map(async (groceryItem) => {
          return request(app.getHttpServer()).delete(
            `/grocery-items/${groceryItem.id}`,
          );
        }),
      );
    });

    it('post grocery item, get all, get by id, delete', async () => {
      const newGroceryItem = {
        name: 'Test',
        description: 'Russian Blue',
        quantity: 1.5,
        unit: 'Each'
      };
      const data = await request(app.getHttpServer())
        .post('/grocery-items')
        .set('Authorization', 'Bearer ' + access_token)
        .send(newGroceryItem)
        .expect(201);
      expect(data.body).toEqual({
        ...newGroceryItem,
        id: expect.any(String),
      });
      const groceryItems = await request(app.getHttpServer())
        .get('/grocery-items')
        .set('Authorization', 'Bearer ' + access_token)
        .expect(200);
      expect(groceryItems.body).toEqual(expect.any(Array));
      expect(groceryItems.body.length).toBe(1);
      expect(groceryItems.body[0]).toEqual({
        ...newGroceryItem,
        id: expect.any(String),
      });
      const sampleGroceryItem = await request(app.getHttpServer())
        .get(`/grocery-items/${data.body.id}`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(200);
      expect(sampleGroceryItem.body).toEqual(data.body);
      return request(app.getHttpServer())
        .delete(`/grocery-items/${data.body.id}`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(200)
        .expect({ deleted: true });
    });
    it('post grocery item, get by id, update, get by id, delete', async () => {
      const newGroceryItem = {
        name: 'Test',
        description: 'Russian Blue',
        quantity: 1.5,
        unit: 'Liter'
      };
      const data = await request(app.getHttpServer())
        .post('/grocery-items')
        .set('Authorization', 'Bearer ' + access_token)
        .send(newGroceryItem)
        .expect(201);
      expect(data.body).toEqual({
        ...newGroceryItem,
        id: expect.any(String),
      });
      const groceryItem = await request(app.getHttpServer())
        .get(`/grocery-items/${data.body.id}`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(200);
      expect(groceryItem.body).toEqual({
        ...newGroceryItem,
        id: expect.any(String),
      });
      const groceryItemV2 = await request(app.getHttpServer())
        .put(`/grocery-items`)
        .set('Authorization', 'Bearer ' + access_token)
        .send({
          id: groceryItem.body.id,
          quantity: 5,
        })
        .expect(200);
      expect(groceryItemV2.body).toEqual({ ...data.body, quantity: 5 });
      const updatedGroceryItem = await request(app.getHttpServer())
        .get(`/grocery-items/${groceryItem.body.id}`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(200);
      expect(updatedGroceryItem.body).toEqual(groceryItemV2.body);
      return request(app.getHttpServer())
        .delete(`/grocery-items/${data.body.id}`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(200)
        .expect({ deleted: true });
    });
  });
});
