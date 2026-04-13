import { CancelOrderUseCaseImpl } from './CancelOrderUseCaseImpl';
import { OrderRepository } from '../../ports/outbound/OrderRepository';
import { InventoryService } from '../../ports/outbound/InventoryService';
import { Order } from '../../domain/entities/Order';
import { OrderStatus } from '../../domain/entities/OrderStatus';

describe('CancelOrderUseCase', () => {
  let useCase: CancelOrderUseCaseImpl;
  let orderRepository: jest.Mocked<OrderRepository>;
  let inventoryService: jest.Mocked<InventoryService>;

  beforeEach(() => {
    orderRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    } as any;

    inventoryService = {
      releaseItems: jest.fn().mockResolvedValue(undefined),
    } as any;

    useCase = new CancelOrderUseCaseImpl(orderRepository, inventoryService);
  });

  it('should cancel order and release inventory successfully', async () => {
    const order = new Order({
      id: 'o1',
      customerId: 'c1',
      items: [{ productId: 'p1', quantity: 2, unitPrice: 10 }],
      freight: 0,
      status: OrderStatus.PENDENTE,
    });

    orderRepository.findById.mockResolvedValue(order);
    orderRepository.save.mockImplementation((o) => Promise.resolve(o));

    await useCase.execute('o1');

    expect(order.status).toBe(OrderStatus.CANCELADO);
    expect(inventoryService.releaseItems).toHaveBeenCalledWith(order.items);
    expect(orderRepository.save).toHaveBeenCalled();
  });
});
