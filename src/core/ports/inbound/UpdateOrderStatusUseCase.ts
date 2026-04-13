import { Order } from '../../domain/entities/Order';
import { OrderStatus } from '../../domain/entities/OrderStatus';

export interface UpdateOrderStatusDTO {
  id: string;
  status: OrderStatus;
}

export interface UpdateOrderStatusUseCase {
  execute(dto: UpdateOrderStatusDTO): Promise<Order>;
}
