"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { CenteredMessagePage } from "@/components/Shared";

export default function PaymentSuccessPage() {
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
      title="¡Pago realizado con éxito!"
      description="Tu pago ha sido procesado correctamente. Recibirás un correo de confirmación en breve."
    />
  );
}
