"use client";

import { PaymentForm } from "@/components/payment";
import { StripeProvider } from "@/components/Shared";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function PaySinglePage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stripe/payment-intent", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  if (!clientSecret) {
    return <Typography align="center">Cargando pago...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 420, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        Pago total de la cuenta
      </Typography>

      <StripeProvider clientSecret={clientSecret}>
        <PaymentForm />
      </StripeProvider>
    </Box>
  );
}
