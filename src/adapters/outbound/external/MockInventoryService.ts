import { InventoryService } from '../../../core/ports/outbound/InventoryService';
import { OrderItem } from '../../../core/domain/entities/Order';

export class MockInventoryService implements InventoryService {
  async reserveItems(items: OrderItem[]): Promise<void> {
    console.log(`[Inventory] Reservando itens: ${JSON.stringify(items)}`);
    // Simulando verificação de estoque
    items.forEach(item => {
      if (item.quantity > 100) {
        throw new Error(`Estoque insuficiente para o produto ${item.productId}`);
      }
    });
    return Promise.resolve();
  }

  async releaseItems(items: OrderItem[]): Promise<void> {
    console.log(`[Inventory] Liberando itens: ${JSON.stringify(items)}`);
    return Promise.resolve();
  }
}
