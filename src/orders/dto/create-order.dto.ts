export class CreateOrderDto {
  customerId: number;
  userId: number;
  items: { productId: number; quantity: number }[];
}