import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroceryItemsController } from './grocery-items.controller';
import { GroceryItemsService } from './grocery-items.service';
import { GroceryItem, GroceryItemSchema } from './schemas/grocery-item.schema';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: GroceryItem.name, schema: GroceryItemSchema }]),
        PassportModule.register({ defaultStrategy: 'jwt' })
    ],
    controllers: [GroceryItemsController],
    providers: [GroceryItemsService],
})
export class GroceryItemsModule { }