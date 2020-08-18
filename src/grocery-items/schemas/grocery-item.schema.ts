import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class GroceryItem extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: false })
  description: string;
}

export const GroceryItemSchema = SchemaFactory.createForClass(GroceryItem);