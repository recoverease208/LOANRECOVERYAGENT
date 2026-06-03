import { supabase } from "@/integrations/supabase";

export async function createPaymentIntent(loanId: string, amount: number) {
  if (!supabase) {
    return {
      orderId: `order_demo_${loanId}`,
      amount,
      currency: "INR",
      checkoutUrl: `https://checkout.razorpay.com/v1/checkout/embedded?order_id=order_demo_${loanId}`
    };
  }

  const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
    body: { loanId, amount }
  });
  if (error) throw error;
  return data;
}
