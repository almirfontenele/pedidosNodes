import { CreateOrderDTO, CreateOrderUseCase } from '../../ports/inbound/CreateOrderUseCase';
import { OrderRepository } from '../../ports/outbound/OrderRepository';
import { InventoryService } from '../../ports/outbound/InventoryService';
import { Order } from '../../domain/entities/Order';

export class CreateOrderUseCaseImpl implements CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly inventoryService: InventoryService,
  ) {}

  async execute(dto: CreateOrderDTO): Promise<Order> {
    // 1. Validar e reservar estoque
    await this.inventoryService.reserveItems(dto.items);

    // 2. Criar a entidade de domínio
    const order = new Order({
      customerId: dto.customerId,
      items: dto.items,
      freight: dto.freight,
    });

    // 3. Persistir
    return this.orderRepository.save(order);
  }
}
