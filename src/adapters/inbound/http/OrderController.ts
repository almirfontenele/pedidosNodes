import { Request, Response } from 'express';
import { CreateOrderUseCase } from '../../../core/ports/inbound/CreateOrderUseCase';
import { UpdateOrderStatusUseCase } from '../../../core/ports/inbound/UpdateOrderStatusUseCase';
import { CancelOrderUseCase } from '../../../core/ports/inbound/CancelOrderUseCase';
import { ListOrdersUseCase } from '../../../core/ports/inbound/ListOrdersUseCase';
import { OrderStatus } from '../../../core/domain/entities/OrderStatus';

export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly listOrdersUseCase: ListOrdersUseCase,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const order = await this.createOrderUseCase.execute(req.body);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const { customerId, status } = req.query;
      const orders = await this.listOrdersUseCase.execute({
        customerId: customerId as string,
        status: status as OrderStatus,
      });
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await this.updateOrderStatusUseCase.execute({ id: id as string, status });
      res.status(200).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async cancel(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.cancelOrderUseCase.execute(id as string);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
