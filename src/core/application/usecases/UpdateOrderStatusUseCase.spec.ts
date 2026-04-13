import { UpdateOrderStatusUseCaseImpl } from './UpdateOrderStatusUseCaseImpl';
import { OrderRepository } from '../../ports/outbound/OrderRepository';
import { Order } from '../../domain/entities/Order';
import { OrderStatus } from '../../domain/entities/OrderStatus';

describe('UpdateOrderStatusUseCase', () => {
  let useCase: UpdateOrderStatusUseCaseImpl;
  let orderRepository: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    orderRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    } as any;

    useCase = new UpdateOrderStatusUseCaseImpl(orderRepository);
  });

  it('should update order status successfully', async () => {
    const order = new Order({
      id: 'o1',
      customerId: 'c1',
      items: [],
      freight: 0,
      status: OrderStatus.PENDENTE,
    });

    orderRepository.findById.mockResolvedValue(order);
    orderRepository.save.mockImplementation((o) => Promise.resolve(o));

    const result = await useCase.execute({ id: 'o1', status: OrderStatus.PAGO });

    expect(result.status).toBe(OrderStatus.PAGO);
    expect(orderRepository.save).toHaveBeenCalled();
  });

  it('should throw error if order not found', async () => {
    orderRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'o1', status: OrderStatus.PAGO })).rejects.toThrow('Pedido não encontrado');
  });
});
