import { Document } from 'mongoose';

export interface GroceryItemDocument extends Document {
  name: string;
  quantity: number;
  description?: string;
  unit?: string;
  userId?: string;
}
