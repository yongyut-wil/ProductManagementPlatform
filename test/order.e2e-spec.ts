import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/prisma/prisma.service';
import { IProductRepository } from '../src/modules/product/domain/product.repository.interface';
import { IOrderRepository } from '../src/modules/order/domain/order.repository.interface';
import { OrderProducer } from '../src/modules/order/infrastructure/queue/order.producer';
import { OrderProcessor } from '../src/modules/order/infrastructure/queue/order.processor';
import { getQueueToken } from '@nestjs/bullmq';

// Mock BullMQAdapter
jest.mock('@bull-board/api/bullMQAdapter', () => {
  return {
    BullMQAdapter: jest.fn().mockImplementation(() => {
      return {
        setChild: jest.fn(),
        setEntrypoint: jest.fn(),
        setQueues: jest.fn(),
        getName: jest.fn().mockReturnValue('orders'),
      };
    }),
  };
});

describe('Order Module (E2E)', () => {
  let app: INestApplication;

  const mockProductRepo = {
    findById: jest.fn(),
    save: jest.fn(),
    updateStock: jest.fn(),
  };
  const mockOrderRepo = {
    save: jest.fn(),
  };
  const mockOrderProducer = {
    addOrderCreatedJob: jest.fn(),
  };

  const mockPrismaService = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn((cb) => cb(mockPrismaService)),
    order: { create: jest.fn() },
    product: { update: jest.fn() },
  };

  const mockQueue = {
    add: jest.fn(),
    close: jest.fn(),
    name: 'orders',
    client: { status: 'ready' },
    toKey: (key) => key,
    getJobCounts: jest.fn().mockResolvedValue({}),
  };

  const mockOrderProcessor = {};

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(IProductRepository)
      .useValue(mockProductRepo)
      .overrideProvider(IOrderRepository)
      .useValue(mockOrderRepo)
      .overrideProvider(OrderProducer)
      .useValue(mockOrderProducer)
      .overrideProvider(OrderProcessor)
      .useValue(mockOrderProcessor)
      .overrideProvider(getQueueToken('orders'))
      .useValue(mockQueue)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/orders (POST) - Success', async () => {
    mockProductRepo.findById.mockResolvedValue({
      id: 'prod-1',
      name: 'Test Product',
      price: 100,
      stock: 10,
    });
    mockProductRepo.updateStock.mockResolvedValue(undefined);
    mockOrderRepo.save.mockResolvedValue(undefined);
    mockOrderProducer.addOrderCreatedJob.mockResolvedValue(undefined);

    return request(app.getHttpServer())
      .post('/orders')
      .send({
        userId: 'user-1',
        items: [{ productId: 'prod-1', quantity: 1 }],
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(mockOrderRepo.save).toHaveBeenCalled();
      });
  });

  it('/orders (POST) - Insufficient Stock', async () => {
    mockProductRepo.findById.mockResolvedValue({
      id: 'prod-1',
      name: 'Test Product',
      price: 100,
      stock: 0,
    });

    return request(app.getHttpServer())
      .post('/orders')
      .send({
        userId: 'user-1',
        items: [{ productId: 'prod-1', quantity: 1 }],
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('Insufficient stock');
      });
  });
});
