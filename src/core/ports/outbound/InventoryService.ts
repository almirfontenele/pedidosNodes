import { OrderItem } from '../../domain/entities/Order';

export interface InventoryService {
  reserveItems(items: OrderItem[]): Promise<void>;
  releaseItems(items: OrderItem[]): Promise<void>;
}
