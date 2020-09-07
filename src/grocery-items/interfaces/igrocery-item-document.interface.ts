import { Document } from 'mongoose';
import { IGroceryItemBase } from './igrocery-item-base.interface';

export interface IGroceryItemDocument extends Document, IGroceryItemBase {}
