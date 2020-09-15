import { Document } from 'mongoose';
import { UserBase } from './user-base.interface';

export interface UserDocument extends Document, UserBase {}
