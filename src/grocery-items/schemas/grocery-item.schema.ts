import { Schema } from 'mongoose';

export const GroceryItemSchema = new Schema({
  name: { type: String, required: true },

  quantity: { type: Number, required: true },

  unit: { type: String, required: false },

  description: { type: String, required: false },

  userId: { type: Schema.Types.ObjectId, ref: 'User' },
});
