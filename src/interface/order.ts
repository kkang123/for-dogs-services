export interface OrderItem {
  orderItemId: string;
  orderProductName: string;
  orderProductQuantity: number;
  orderProductUnitPrice: number;
}

export interface Order {
  orderId: string;
  orderStatus: string;
  orderTotalPrice: number;
  paymentId: string;
  orderItems: OrderItem[];
}
