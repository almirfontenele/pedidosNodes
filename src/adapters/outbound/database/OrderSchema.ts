import mongoose, { Schema, Document } from 'mongoose';
import { OrderStatus } from '../../../core/domain/entities/OrderStatus';

export interface OrderDocument extends Document {
  customerId: string;
  status: OrderStatus;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  freight: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
}, { _id: false });

const OrderSchema = new Schema({
  customerId: { type: String, required: true, index: true },
  status: { 
    type: String, 
    enum: Object.values(OrderStatus), 
    default: OrderStatus.PENDENTE,
    index: true 
  },
  items: [OrderItemSchema],
  freight: { type: Number, required: true },
  total: { type: Number, required: true },
}, { 
  timestamps: true,
  versionKey: false 
});

export const OrderModel = mongoose.model<OrderDocument>('Order', OrderSchema);
