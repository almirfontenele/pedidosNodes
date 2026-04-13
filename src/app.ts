import express from 'express';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './docs/swagger.json';
import { MongoOrderRepository } from './adapters/outbound/database/MongoOrderRepository';
import { MockInventoryService } from './adapters/outbound/external/MockInventoryService';
import { CreateOrderUseCaseImpl } from './core/application/usecases/CreateOrderUseCaseImpl';
import { UpdateOrderStatusUseCaseImpl } from './core/application/usecases/UpdateOrderStatusUseCaseImpl';
import { CancelOrderUseCaseImpl } from './core/application/usecases/CancelOrderUseCaseImpl';
import { ListOrdersUseCaseImpl } from './core/application/usecases/ListOrdersUseCaseImpl';
import { OrderController } from './adapters/inbound/http/OrderController';
import { createOrderRouter } from './adapters/inbound/http/OrderRouter';

export function createApp() {
  const orderRepository = new MongoOrderRepository();
  const inventoryService = new MockInventoryService();

  const createOrderUseCase = new CreateOrderUseCaseImpl(orderRepository, inventoryService);
  const updateOrderStatusUseCase = new UpdateOrderStatusUseCaseImpl(orderRepository);
  const cancelOrderUseCase = new CancelOrderUseCaseImpl(orderRepository, inventoryService);
  const listOrdersUseCase = new ListOrdersUseCaseImpl(orderRepository);

  const orderController = new OrderController(
    createOrderUseCase,
    updateOrderStatusUseCase,
    cancelOrderUseCase,
    listOrdersUseCase
  );

  const app = express();
  app.use(express.json());

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/orders', createOrderRouter(orderController));

  return app;
}
