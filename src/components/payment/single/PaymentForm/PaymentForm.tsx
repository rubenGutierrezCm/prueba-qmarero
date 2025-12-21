"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button, CircularProgress, Box } from "@mui/material";
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

      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={handleSubmit}
        disabled={loading || !stripe}
        sx={{ mt: 3 }}
      >
        {loading ? <CircularProgress size={24} /> : "Pagar ahora"}
      </Button>
    </Box>
  );
}
