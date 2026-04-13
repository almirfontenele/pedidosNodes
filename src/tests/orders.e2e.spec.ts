import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../app';
import { OrderStatus } from '../core/domain/entities/OrderStatus';

describe('Orders API E2E', () => {
  let mongoServer: MongoMemoryServer;
  let app: any;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    app = createApp();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await mongoose.connection.db?.dropDatabase();
  });

  it('should create and list orders', async () => {
    const payload = {
      customerId: 'customer-123',
      items: [
        { productId: 'prod-1', quantity: 2, unitPrice: 50 },
        { productId: 'prod-2', quantity: 1, unitPrice: 100 }
      ],
      freight: 20
    };

    // Create
    const createRes = await request(app)
      .post('/orders')
      .send(payload)
      .expect(201);

    expect(createRes.body.total).toBe(220);
    expect(createRes.body.status).toBe(OrderStatus.PENDENTE);
    const orderId = createRes.body.id;

    // List
    const listRes = await request(app)
      .get('/orders')
      .query({ customerId: 'customer-123' })
      .expect(200);

    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].id).toBe(orderId);
  });

  it('should flow through order status updates', async () => {
    // 1. Create
    const createRes = await request(app)
      .post('/orders')
      .send({
        customerId: 'c1',
        items: [{ productId: 'p1', quantity: 1, unitPrice: 10 }],
        freight: 0
      });
    
    const orderId = createRes.body.id;

    // 2. Pay
    await request(app)
      .patch(`/orders/${orderId}/status`)
      .send({ status: OrderStatus.PAGO })
      .expect(200);

    // 3. Ship
    const shipRes = await request(app)
      .patch(`/orders/${orderId}/status`)
      .send({ status: OrderStatus.ENVIADO })
      .expect(200);

    expect(shipRes.body.status).toBe(OrderStatus.ENVIADO);

    // 4. Try Cancel (should fail)
    await request(app)
      .delete(`/orders/${orderId}`)
      .expect(400);
  });

  it('should cancel pending order successfully', async () => {
    const createRes = await request(app)
      .post('/orders')
      .send({
        customerId: 'c1',
        items: [{ productId: 'p1', quantity: 1, unitPrice: 10 }],
        freight: 0
      });
    
    const orderId = createRes.body.id;

    await request(app)
      .delete(`/orders/${orderId}`)
      .expect(204);

    const listRes = await request(app).get('/orders');
    expect(listRes.body[0].status).toBe(OrderStatus.CANCELADO);
  });
});
