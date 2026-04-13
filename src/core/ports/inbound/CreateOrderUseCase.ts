import { Order } from '../../domain/entities/Order';

export interface CreateOrderItemDTO {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderDTO {
  customerId: string;
  items: CreateOrderItemDTO[];
  freight: number;
}

export interface CreateOrderUseCase {
  execute(dto: CreateOrderDTO): Promise<Order>;
}
