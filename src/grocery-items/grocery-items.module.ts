import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroceryItemsController } from './grocery-items.controller';
import { GroceryItemsService } from './grocery-items.service';
import { GroceryItemSchema } from './schemas/grocery-item.schema';
import { PassportModule } from '@nestjs/passport';
import { GroceryItemsRepository } from './grocery-items.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GroceryItem', schema: GroceryItemSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [GroceryItemsController],
  providers: [GroceryItemsService, GroceryItemsRepository],
})
export class GroceryItemsModule {}
