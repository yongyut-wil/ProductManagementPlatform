import { Entity } from '../../../shared/core/entity';
import { v4 as uuidv4 } from 'uuid';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItemProps {
  productId: string;
  quantity: number;
  price: number;
}

export interface OrderProps {
  userId: string;
  items: OrderItemProps[];
  status: OrderStatus;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order extends Entity<OrderProps> {
  private constructor(props: OrderProps, id?: string) {
    super(props, id);
  }

  static create(props: Omit<OrderProps, 'status' | 'total'>, id?: string): Order {
    const total = props.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return new Order(
      {
        ...props,
        status: OrderStatus.PENDING,
        total,
      },
      id || uuidv4(),
    );
  }

  get userId(): string { return this.props.userId; }
  get items(): OrderItemProps[] { return this.props.items; }
  get status(): OrderStatus { return this.props.status; }
  get total(): number { return this.props.total; }
}
