import { CreateOrderUseCaseImpl } from './CreateOrderUseCaseImpl';
import { OrderRepository } from '../../ports/outbound/OrderRepository';
import { InventoryService } from '../../ports/outbound/InventoryService';
import { OrderStatus } from '../../domain/entities/OrderStatus';

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCaseImpl;
  let orderRepository: jest.Mocked<OrderRepository>;
  let inventoryService: jest.Mocked<InventoryService>;

  beforeEach(() => {
    orderRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as any;

    inventoryService = {
      reserveItems: jest.fn().mockResolvedValue(undefined),
      releaseItems: jest.fn(),
    } as any;

    useCase = new CreateOrderUseCaseImpl(orderRepository, inventoryService);
  });

  it('should create an order successfully', async () => {
    const dto = {
      customerId: 'c1',
      items: [{ productId: 'p1', quantity: 2, unitPrice: 10 }],
      freight: 5,
    };

    orderRepository.save.mockImplementation((order) => Promise.resolve(order));

    const result = await useCase.execute(dto);

    expect(inventoryService.reserveItems).toHaveBeenCalledWith(dto.items);
    expect(orderRepository.save).toHaveBeenCalled();
    expect(result.customerId).toBe(dto.customerId);
    expect(result.status).toBe(OrderStatus.PENDENTE);
    expect(result.total).toBe(25);
  });

  it('should not save order if inventory reservation fails', async () => {
    const dto = {
      customerId: 'c1',
      items: [{ productId: 'p1', quantity: 2, unitPrice: 10 }],
      freight: 5,
    };

    inventoryService.reserveItems.mockRejectedValue(new Error('Out of stock'));

    await expect(useCase.execute(dto)).rejects.toThrow('Out of stock');
    expect(orderRepository.save).not.toHaveBeenCalled();
  });
});
