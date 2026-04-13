import { Order } from '../../domain/entities/Order';
import { OrderFilters } from '../outbound/OrderRepository';

export interface ListOrdersUseCase {
  execute(filters: OrderFilters): Promise<Order[]>;
}
