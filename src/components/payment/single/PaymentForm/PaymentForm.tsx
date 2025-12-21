"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Box } from "@mui/material";
import { LoadingButton } from "@/components/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      setError(error.message || "Error en el pago");
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Pago exitoso, redirigir a la página de éxito
      router.push("/payment/success");
    } else {
      setLoading(false);
    }
  };

  return (
    <Box>
      <PaymentElement />

      {error && (
        <Box sx={{ color: "error.main", mt: 2 }}>{error}</Box>
      )}

      <LoadingButton
        size="large"
        fullWidth
        onClick={handleSubmit}
        disabled={!stripe}
        loading={loading}
        loadingText="Procesando..."
        sx={{ mt: 3 }}
      >
        Pagar ahora
      </LoadingButton>
    </Box>
  );
}
