"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button, CircularProgress, Box } from "@mui/material";
import { useState } from "react";

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/payment/success",
      },
      redirect: "if_required",
    });

    if (error) {
      setError(error.message || "Error en el pago");
    }

    setLoading(false);
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
