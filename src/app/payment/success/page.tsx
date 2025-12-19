"use client";

import { Box, Typography, Container } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function PaymentSuccessPage() {

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 3,
          width: "100%",
        }}
      >
        <CheckCircleIcon
          sx={{
            fontSize: 80,
            color: "success.main",
          }}
        />

        <Typography variant="h4" component="h1" gutterBottom>
          ¡Pago realizado con éxito!
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Tu pago ha sido procesado correctamente. Recibirás un correo de
          confirmación en breve.
        </Typography>
      </Box>
    </Container>
  );
}
