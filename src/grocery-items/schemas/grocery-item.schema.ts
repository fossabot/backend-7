import {
  Prop,
  Schema as SchemaDefinition,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document, Schema } from 'mongoose';

@SchemaDefinition()
export class GroceryItem extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true, type: Schema.Types.ObjectId, ref: 'User' })
  userId: string;
}

export const GroceryItemSchema = SchemaFactory.createForClass(GroceryItem);
