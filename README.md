# 📦 Enterprise Product Management Platform (NestJS Backend)

โปรเจกต์นี้เป็น Backend สำหรับระบบจัดการสินค้าและคำสั่งซื้อระดับ Enterprise พัฒนาด้วย **NestJS** โดยใช้สถาปัตยกรรม **Hexagonal Architecture (Ports and Adapters)** เพื่อให้โค้ดมีความยืดหยุ่น ทดสอบง่าย และรองรับการขยายตัวในอนาคต

## 🚀 Tech Stack

-   **Language**: TypeScript
-   **Framework**: NestJS
-   **Database**: PostgreSQL
-   **ORM**: Prisma
-   **Queue & Async**: BullMQ + Redis
-   **Authentication**: JWT + RBAC (Role-Based Access Control)
-   **Monitoring**: Bull Board
-   **Architecture**: Modular + Hexagonal (Clean Architecture)
-   **Testing**: Jest (Unit & E2E)
-   **Infrastructure**: Docker & Docker Compose

---

## 🏗️ Architecture Overview (สถาปัตยกรรม)

โปรเจกต์นี้แยก Layer อย่างชัดเจนตามหลักการ Hexagonal Architecture:

1.  **Domain Layer** (`src/modules/*/domain`):
    -   เก็บ **Entities** และ **Business Logic**
    -   กำหนด **Repository Interfaces** (Ports)
    -   *ไม่ขึ้นกับ Framework หรือ Database ใดๆ*
2.  **Application Layer** (`src/modules/*/application`):
    -   เก็บ **Use Cases** (Business Flows)
    -   เก็บ **DTOs** (Data Transfer Objects)
    -   เรียกใช้ Domain Objects และ Interfaces
3.  **Infrastructure Layer** (`src/modules/*/infrastructure`):
    -   เก็บ **Adapters** ที่ implement Interfaces จาก Domain (เช่น PrismaRepository)
    -   เก็บ **Controllers** (HTTP Adapters)
    -   เก็บ **Queue Consumers/Producers**

---

## 🛠️ การติดตั้งและเริ่มต้นใช้งาน (Setup Guide)

### 1. Prerequisites (สิ่งที่ต้องมี)
-   Node.js (v18+)
-   Docker & Docker Compose
-   npm หรือ yarn

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` ที่ root folder (หรือใช้ไฟล์ที่สร้างให้แล้ว):
```env
# Database connection (สำหรับ Docker Compose)
DATABASE_URL="postgresql://postgres:password@localhost:5432/enterprise_db?schema=public"

# Redis connection
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Secret
JWT_SECRET=your_super_secret_key
```

### 4. รัน Infrastructure (Database & Redis)
เราใช้ Docker Compose เพื่อจำลอง Database และ Redis:
```bash
docker-compose up -d
```
*รอสักครู่ให้ Container เริ่มทำงานเสร็จสมบูรณ์*

### 5. Setup Database Schema (Prisma)
สร้าง Table ใน Database ตาม Schema ที่กำหนดไว้:
```bash
npx prisma migrate dev --name init
```

### 6. รันโปรเจกต์
**โหมด Development:**
```bash
npm run start:dev
```

**โหมด Production:**
```bash
npm run build
npm run start:prod
```

---

## 🧪 การทดสอบ (Testing)

### Unit Tests
ทดสอบ Business Logic ในระดับ UseCase และ Service:
```bash
npm run test
```

### E2E Tests (End-to-End)
ทดสอบ Flow การทำงานจริงตั้งแต่ API จนถึง Database (จำลอง):
```bash
npm run test:e2e
```

---

## 📚 คู่มือการใช้งาน API (API Guide)

### 1. Authentication (ระบบยืนยันตัวตน)

**Register (สมัครสมาชิก)**
-   **POST** `/auth/register`
-   **Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "name": "John Doe"
    }
    ```

**Login (เข้าสู่ระบบ)**
-   **POST** `/auth/login`
-   **Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
-   **Response**: ได้รับ `accessToken` เพื่อใช้แนบใน Header (`Authorization: Bearer <token>`)

### 2. Products (จัดการสินค้า)

**Create Product (สร้างสินค้า)**
-   **POST** `/products`
-   **Headers**: `Authorization: Bearer <token>`
-   **Body**:
    ```json
    {
      "name": "iPhone 15",
      "description": "Latest Apple Phone",
      "price": 35000,
      "stock": 100
    }
    ```

**Get All Products (ดูสินค้าทั้งหมด)**
-   **GET** `/products`

### 3. Orders (สั่งซื้อสินค้า)

**Place Order (สั่งซื้อ)**
-   **POST** `/orders`
-   **Body**:
    ```json
    {
      "userId": "<USER_ID_FROM_DB>",
      "items": [
        {
          "productId": "<PRODUCT_ID_FROM_DB>",
          "quantity": 1
        }
      ]
    }
    ```
-   **Process**:
    1.  ตรวจสอบ Stock สินค้า
    2.  ตัด Stock (Atomic Transaction)
    3.  บันทึก Order ลง Database
    4.  ส่งงานเข้า Queue (`orders` queue) เพื่อส่งอีเมลแจ้งเตือน (Async)

---

## 📊 Monitoring (ระบบติดตาม)

โปรเจกต์นี้ติดตั้ง **Bull Board** เพื่อดูสถานะของ Queue (Waiting, Active, Completed, Failed)

-   เปิด Browser ไปที่: `http://localhost:3000/queues`

---

## 📂 โครงสร้างโฟลเดอร์ (Folder Structure)

```
src/
├── app.module.ts            # Main Module
├── main.ts                  # Entry Point
├── infrastructure/          # Shared Infrastructure (Prisma, Config)
│   └── prisma/
├── shared/                  # Shared Kernel (Entity, Result, DTOs)
│   ├── core/                # Core classes (Entity, Result, TransactionManager)
│   └── dto/                 # Generic DTOs (ApiResponse)
└── modules/                 # Feature Modules
    ├── auth/                # Authentication Module
    │   ├── domain/          # User Entity, Repository Interface
    │   ├── application/     # Register/Login UseCases, DTOs
    │   └── infrastructure/  # AuthController, PrismaUserRepository, Strategies
    ├── product/             # Product Module
    └── order/               # Order Module
        ├── domain/
        ├── application/
        └── infrastructure/
            ├── http/        # Controllers
            ├── repositories/# Prisma Repository Implementation
            └── queue/       # BullMQ Producer & Processor (Worker)
```

## 💡 Developer Guide

### การเพิ่มฟีเจอร์ใหม่ (How to add a new feature)

1.  **Domain**:
    -   สร้าง `Entity` ใน `domain/`
    -   กำหนด `Repository Interface` ใน `domain/`
2.  **Application**:
    -   สร้าง `UseCase` ใน `application/use-cases/`
    -   สร้าง `DTO` สำหรับ Input/Output
3.  **Infrastructure**:
    -   Implement Repository Interface ใน `infrastructure/repositories/`
    -   สร้าง `Controller` เพื่อรับ Request
    -   เชื่อมต่อทุกอย่างใน `Module`

### Transaction Management
หากต้องการให้หลาย Operation ทำงานพร้อมกันแบบ Atomic (สำเร็จทั้งหมด หรือล้มเหลวทั้งหมด):
-   Inject `ITransactionManager` เข้าไปใน UseCase
-   ใช้คำสั่ง `await this.transactionManager.run(async (context) => { ... })`
-   ส่ง `context` ไปยัง Repository methods

```typescript
await this.transactionManager.run(async (context) => {
  await this.orderRepo.save(order, context);
  await this.productRepo.updateStock(productId, qty, context);
});
```
