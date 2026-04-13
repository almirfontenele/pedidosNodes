import { ListOrdersUseCaseImpl } from './ListOrdersUseCaseImpl';
import { OrderRepository, OrderFilters } from '../../ports/outbound/OrderRepository';
import { Order } from '../../domain/entities/Order';

describe('ListOrdersUseCase', () => {
  let useCase: ListOrdersUseCaseImpl;
  let orderRepository: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    orderRepository = {
      findAll: jest.fn(),
    } as any;

    useCase = new ListOrdersUseCaseImpl(orderRepository);
  });

  it('should list orders with filters successfully', async () => {
    const orders = [
      new Order({ customerId: 'c1', items: [], freight: 0 }),
      new Order({ customerId: 'c1', items: [], freight: 0 }),
    ];

    const filters: OrderFilters = { customerId: 'c1' };
    orderRepository.findAll.mockResolvedValue(orders);

    const result = await useCase.execute(filters);

    expect(result).toHaveLength(2);
    expect(orderRepository.findAll).toHaveBeenCalledWith(filters);
  });
});
