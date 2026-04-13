import { OrderStatus } from './OrderStatus';

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderProps {
  id?: string;
  customerId: string;
  status?: OrderStatus;
  items: OrderItem[];
  freight: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order {
  private readonly _id?: string;
  private readonly _customerId: string;
  private _status: OrderStatus;
  private readonly _items: OrderItem[];
  private readonly _freight: number;
  private readonly _total: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: OrderProps) {
    this._id = props.id;
    this._customerId = props.customerId;
    this._status = props.status ?? OrderStatus.PENDENTE;
    this._items = props.items;
    this._freight = props.freight;
    this._total = this.calculateTotal();
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get id(): string | undefined {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get items(): OrderItem[] {
    return [...this._items];
  }

  get freight(): number {
    return this._freight;
  }

  get total(): number {
    return this._total;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  private calculateTotal(): number {
    const itemsTotal = this._items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    return itemsTotal + this._freight;
  }

  pay(): void {
    if (this._status !== OrderStatus.PENDENTE) {
      throw new Error('Apenas pedidos PENDENTES podem ser pagos');
    }
    this._status = OrderStatus.PAGO;
    this._updatedAt = new Date();
  }

  ship(): void {
    if (this._status !== OrderStatus.PAGO) {
      throw new Error('Pedido deve estar PAGO para ser enviado');
    }
    this._status = OrderStatus.ENVIADO;
    this._updatedAt = new Date();
  }

  cancel(): void {
    if (this._status === OrderStatus.ENVIADO) {
      throw new Error('Pedido enviado não pode ser cancelado');
    }
    this._status = OrderStatus.CANCELADO;
    this._updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this._id,
      customerId: this._customerId,
      status: this._status,
      items: this._items,
      freight: this._freight,
      total: this._total,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
