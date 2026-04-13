import { Order } from './Order';
import { OrderStatus } from './OrderStatus';

describe('Order Entity', () => {
  it('should create an order with PENDENTE status by default', () => {
    const order = new Order({
      customerId: 'customer-1',
      items: [{ productId: 'p1', quantity: 2, unitPrice: 10 }],
      freight: 5,
    });

    expect(order.status).toBe(OrderStatus.PENDENTE);
  });

  it('should calculate the total correctly', () => {
    const order = new Order({
      customerId: 'customer-1',
      items: [
        { productId: 'p1', quantity: 2, unitPrice: 10 },
        { productId: 'p2', quantity: 1, unitPrice: 20 },
      ],
      freight: 5,
    });

    expect(order.total).toBe(45); // (2*10) + (1*20) + 5
  });

  it('should allow transition from PENDENTE to PAGO', () => {
    const order = new Order({
      customerId: 'customer-1',
      items: [{ productId: 'p1', quantity: 1, unitPrice: 10 }],
      freight: 0,
    });

    order.pay();
    expect(order.status).toBe(OrderStatus.PAGO);
  });

  it('should allow transition from PAGO to ENVIADO', () => {
    const order = new Order({
      customerId: 'customer-1',
      items: [{ productId: 'p1', quantity: 1, unitPrice: 10 }],
      freight: 0,
    });

    order.pay();
    order.ship();
    expect(order.status).toBe(OrderStatus.ENVIADO);
  });

  it('should allow transition from PENDENTE to CANCELADO', () => {
    const order = new Order({
      customerId: 'customer-1',
      items: [{ productId: 'p1', quantity: 1, unitPrice: 10 }],
      freight: 0,
    });

    order.cancel();
    expect(order.status).toBe(OrderStatus.CANCELADO);
  });

  it('should not allow cancellation if status is ENVIADO', () => {
    const order = new Order({
      customerId: 'customer-1',
      items: [{ productId: 'p1', quantity: 1, unitPrice: 10 }],
      freight: 0,
    });

    order.pay();
    order.ship();

    expect(() => order.cancel()).toThrow('Pedido enviado não pode ser cancelado');
  });

  it('should not allow transition from PENDENTE to ENVIADO without payment', () => {
    const order = new Order({
      customerId: 'customer-1',
      items: [{ productId: 'p1', quantity: 1, unitPrice: 10 }],
      freight: 0,
    });

    expect(() => order.ship()).toThrow('Pedido deve estar PAGO para ser enviado');
  });
});
