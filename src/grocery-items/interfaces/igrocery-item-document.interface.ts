import { Document } from 'mongoose';
import { IGroceryItem } from './igrocery-item.interface';

export interface IGroceryItemDocument extends IGroceryItem, Document {}
