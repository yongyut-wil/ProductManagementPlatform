import { Entity } from '../../../shared/core/entity';

export interface ProductProps {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product extends Entity<ProductProps> {
  private constructor(props: ProductProps, id?: string) {
    super(props, id);
  }

  static create(props: ProductProps, id?: string): Product {
    if (props.price < 0) {
      throw new Error('Price cannot be negative');
    }
    if (props.stock < 0) {
      throw new Error('Stock cannot be negative');
    }
    return new Product(props, id);
  }

  get name(): string { return this.props.name; }
  get price(): number { return this.props.price; }
  get stock(): number { return this.props.stock; }
}
