import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module'; // 👈 IMPORTANTE

@Module({
  imports: [PrismaModule], // 👈 AQUI ESTÁ A CORREÇÃO
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}