"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { CenteredMessagePage } from "@/components/Shared";

export default function ConfirmationPage() {
  return (
    <CenteredMessagePage
      icon={
        <CheckCircleIcon
          sx={{
            fontSize: 80,
            color: "success.main",
          }}
        />
      }
      title="¡Correos enviados!"
      description="Se han enviado los correos electrónicos correctamente. Cada persona recibirá un enlace único para realizar su pago."
    />
  );
}
