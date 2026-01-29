import { Injectable } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.interface';
import { Product } from '../../domain/product.entity';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async save(product: Product): Promise<void> {
    const data = {
      name: product.name,
      description: product.props.description,
      price: new Prisma.Decimal(product.price),
      stock: product.stock,
    };

    if (product.id) {
      await this.prisma.product.upsert({
        where: { id: product.id },
        update: data,
        create: { ...data, id: product.id },
      });
    } else {
      await this.prisma.product.create({
        data: data,
      });
    }
  }

  async findById(id: string): Promise<Product | null> {
    const p = await this.prisma.product.findUnique({ where: { id } });
    if (!p) return null;
    return this.toDomain(p);
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return products.map((p) => this.toDomain(p));
  }

  async updateStock(id: string, quantity: number, context?: unknown): Promise<void> {
    const prisma = (context as Prisma.TransactionClient) || this.prisma;
    await prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });
  }

  private toDomain(p: any): Product {
    return Product.create(
      {
        name: p.name,
        description: p.description,
        price: p.price.toNumber(),
        stock: p.stock,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      },
      p.id,
    );
  }
}
