import { Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  password: number;
  name?: string;
}
