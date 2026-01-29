import { Order } from './order.entity';

export interface IOrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
}

export const IOrderRepository = Symbol('IOrderRepository');
