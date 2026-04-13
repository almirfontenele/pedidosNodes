import { UpdateOrderStatusDTO, UpdateOrderStatusUseCase } from '../../ports/inbound/UpdateOrderStatusUseCase';
import { OrderRepository } from '../../ports/outbound/OrderRepository';
import { Order } from '../../domain/entities/Order';
import { OrderStatus } from '../../domain/entities/OrderStatus';

export class UpdateOrderStatusUseCaseImpl implements UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(dto: UpdateOrderStatusDTO): Promise<Order> {
    const order = await this.orderRepository.findById(dto.id);

    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    switch (dto.status) {
      case OrderStatus.PAGO:
        order.pay();
        break;
      case OrderStatus.ENVIADO:
        order.ship();
        break;
      case OrderStatus.CANCELADO:
        order.cancel();
        break;
      default:
        throw new Error('Status inválido para atualização direta');
    }

    return this.orderRepository.save(order);
  }
}
