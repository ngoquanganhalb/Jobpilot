import { CheckoutDto } from "@/dtos/payment/CheckoutDto";
import { BaseService } from "@services/base.service";

export type PaymentResponse = {
  paymentIntentId: any;
  clientSecret: any;
  checkoutSessionId: string;
  checkoutUrl: string;
  status: string;
  message: string;
};

class PaymentService extends BaseService {
  constructor() {
    super("");
  }

  public checkout(checkoutData: CheckoutDto) {
    const payload = {
      currency: "usd",
      description: "payment for order",
      paymentMethodId: "stripe",
      ...checkoutData,
    };

    return this.postResponse<PaymentResponse>("/checkout", payload, {
      ignoreBaseURL: true,
      baseURL: `${process.env.NEXT_PUBLIC_API_JAVA_BASE_URL}/api/v1/payment/stripe/`,
    }).then((res) => {
      return res;
    });
  }
}
export const paymentService = new PaymentService();
