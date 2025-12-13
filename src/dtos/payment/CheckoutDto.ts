export type CheckoutDto = {
  customerId: number;
  orderId: string;
  amount: number;
  customerName: string;
  paymentMethodId?: string; // Optional
  currency?: string; // Optional
  description?: string; // Optional
  successUrl?: string;
  cancelUrl?: string;
};
