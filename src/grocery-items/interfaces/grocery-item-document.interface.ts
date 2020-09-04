import { Document } from 'mongoose';

export interface GroceryItemDocument extends Document {
  name: string;
  quantity: number;
  unit?: string;
  description?: string;
  userId?: string;
}
