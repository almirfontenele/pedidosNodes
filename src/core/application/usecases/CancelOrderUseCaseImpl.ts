import { CancelOrderUseCase } from '../../ports/inbound/CancelOrderUseCase';
import { OrderRepository } from '../../ports/outbound/OrderRepository';
import { InventoryService } from '../../ports/outbound/InventoryService';

export class CancelOrderUseCaseImpl implements CancelOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly inventoryService: InventoryService,
  ) {}

  async execute(id: string): Promise<void> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    // 1. Alterar status (valida regra de negócio na entidade)
    order.cancel();

    // 2. Devolver estoque
    await this.inventoryService.releaseItems(order.items);

    // 3. Persistir
    await this.orderRepository.save(order);
  }
}
