"use client";

import {
  Box,
  Container,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ConfirmationPage() {

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
          ¡Correos enviados!
        </Typography>

        <Box>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
            <Typography variant="body1">
              Se han enviado los correos electrónicos correctamente
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
