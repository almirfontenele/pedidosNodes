import { ListOrdersUseCase } from '../../ports/inbound/ListOrdersUseCase';
import { OrderRepository, OrderFilters } from '../../ports/outbound/OrderRepository';
import { Order } from '../../domain/entities/Order';

export class ListOrdersUseCaseImpl implements ListOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(filters: OrderFilters): Promise<Order[]> {
    return this.orderRepository.findAll(filters);
  }
}
