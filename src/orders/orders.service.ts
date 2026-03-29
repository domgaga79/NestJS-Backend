import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(data: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: data.items.map(i => i.productId) } },
      });

      let total = 0;

      const itemsData = data.items.map((item) => {
        const product = products.find(p => p.id === item.productId);

        if (!product) {
          throw new BadRequestException(`Produto ${item.productId} não encontrado`);
        }

        if (product.stock !== null && product.stock < item.quantity) {
          throw new BadRequestException(
            `Estoque insuficiente para ${product.name}`,
          );
        }

        total += product.price * item.quantity;

        return {
          quantity: item.quantity,
          price: product.price,
          productId: item.productId,
        };
      });

      const order = await tx.order.create({
        data: {
          customerId: data.customerId,
          userId: data.userId,
          status: 'PENDING',
          total,
          items: {
            create: itemsData,
          },
        },
        include: {
          customer: true,
          user: true,
          items: { include: { product: true } },
        },
      });

      // 📉 Atualizar estoque
      for (const item of itemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        customer: true,
        user: true,
        items: { include: { product: true } },
      },
    });
  }
}