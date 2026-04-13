import { Order } from '../../../core/domain/entities/Order';
import { OrderRepository, OrderFilters } from '../../../core/ports/outbound/OrderRepository';
import { OrderModel, OrderDocument } from './OrderSchema';

export class MongoOrderRepository implements OrderRepository {
  async save(order: Order): Promise<Order> {
    const data = {
      customerId: order.customerId,
      status: order.status,
      items: order.items,
      freight: order.freight,
      total: order.total,
    };

    let orderDoc: OrderDocument | null;

    if (order.id) {
      orderDoc = await OrderModel.findByIdAndUpdate(
        order.id,
        { $set: data },
        { returnDocument: 'after', upsert: true }
      );
    } else {
      orderDoc = await OrderModel.create(data);
    }

    if (!orderDoc) {
      throw new Error('Falha ao salvar o pedido no banco de dados');
    }

    return this.mapToDomain(orderDoc);
  }

  async findById(id: string): Promise<Order | null> {
    const orderDoc = await OrderModel.findById(id);
    if (!orderDoc) return null;
    return this.mapToDomain(orderDoc);
  }

  async findAll(filters: OrderFilters): Promise<Order[]> {
    const query: any = {};
    if (filters.customerId) query.customerId = filters.customerId;
    if (filters.status) query.status = filters.status;

    const docs = await OrderModel.find(query).sort({ createdAt: -1 });
    return docs.map(doc => this.mapToDomain(doc));
  }

  async delete(id: string): Promise<void> {
    await OrderModel.findByIdAndDelete(id);
  }

  private mapToDomain(doc: OrderDocument): Order {
    return new Order({
      id: doc._id.toString(),
      customerId: doc.customerId,
      status: doc.status,
      items: doc.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      freight: doc.freight,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
