import { Product } from './product.entity';

export interface IProductRepository {
  save(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  updateStock(id: string, quantity: number): Promise<void>;
}

export const IProductRepository = Symbol('IProductRepository');
