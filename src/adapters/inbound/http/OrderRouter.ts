import { Router } from 'express';
import { OrderController } from './OrderController';

export function createOrderRouter(orderController: OrderController): Router {
  const router = Router();

  router.post('/', (req, res) => orderController.create(req, res));
  router.get('/', (req, res) => orderController.list(req, res));
  router.patch('/:id/status', (req, res) => orderController.updateStatus(req, res));
  router.delete('/:id', (req, res) => orderController.cancel(req, res));

  return router;
}
