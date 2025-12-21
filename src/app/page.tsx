/**
 * Home page - Payment options selector
 * Allows users to choose between single payment, equal split, or custom split
 */
"use client";

import { Box, Button, Typography, Stack } from "@mui/material";
import { useRouter } from "next/navigation";

export default function PaymentOptions() {

  const router = useRouter();

   const handleChangeRoute = (url: string) => {
    router.push(url)
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 420 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          ¿Cómo quieres pagar?
        </Typography>

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Selecciona una opción para continuar con el pago
        </Typography>

        <Stack spacing={2}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => handleChangeRoute("payment/single")}
          >
            Pagar todo yo
          </Button>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={() => handleChangeRoute("payment/equal")}
          >
            Dividir entre todos
          </Button>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={() => handleChangeRoute("payment/split")}
          >
            Cada uno paga lo suyo
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
