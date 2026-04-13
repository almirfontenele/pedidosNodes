import { Order } from '../../domain/entities/Order';
import { OrderStatus } from '../../domain/entities/OrderStatus';

export interface OrderFilters {
  customerId?: string;
  status?: OrderStatus;
}

export interface OrderRepository {
  save(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findAll(filters: OrderFilters): Promise<Order[]>;
  delete(id: string): Promise<void>;
}
