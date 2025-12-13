import { CheckoutDto } from "@/dtos/payment/CheckoutDto";
import { paymentService } from "@services/payment/payment.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const UseCheckout = () => {
  const { mutateAsync, isError, isSuccess } = useMutation({
    mutationFn: (checkout: CheckoutDto) => paymentService.checkout(checkout),

    onError: (error: any) => {
      toast.error("Checkout failed: " + (error?.message || "Unknown error"));
    },

    // onSuccess: () => {
    //   toast.success("Redirecting to Stripe...");
    // },
  });

  return {
    mutateAsync,
    isError,
    isSuccess,
  };
};
