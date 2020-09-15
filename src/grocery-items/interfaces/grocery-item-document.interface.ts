import { Document } from 'mongoose';
import { GroceryItemBase } from './grocery-item-base.interface';

export interface GroceryItemDocument extends Document, GroceryItemBase {}
