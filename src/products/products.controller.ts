import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { Body, Post } from '@nestjs/common';

//@UseGuards(AuthGuard('jwt'))
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }
  
  @Post()
  create(@Body() body: { name: string; price: number; stock: number }) {
    return this.productsService.create(body);
  }
  
}