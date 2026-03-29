import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany();
  }
  
  async create(data: { name: string; price: number; stock: number }) {
    return this.prisma.product.create({
      data,
    });
  }
  
}