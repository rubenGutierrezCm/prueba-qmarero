/**
 * BillSummaryStep - Shows complete bill summary with items
 * Collects user email and sends payment link directly
 */
"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  Button,
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import WarningIcon from "@mui/icons-material/Warning";
import { useRouter } from "next/navigation";
import { Bill } from "@/types/bill";
import { saveSession, createPayment } from "@/lib/indexeddb";
import { generatePaymentEmail } from "@/lib/emailTemplate";
import { LoadingButton, StatusAlert } from "@/components/ui";

interface BillSummaryStepProps {
  bill: Bill;
  totalBill: number;
}

export const BillSummaryStep = ({
  bill,
  totalBill,
}: BillSummaryStepProps) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleConfirmAndSendEmail = async () => {
    const newErrors = { name: "", email: "" };
    let hasError = false;

    if (!name.trim()) {
      newErrors.name = "El nombre es obligatorio";
      hasError = true;
    }

    if (!email.trim()) {
      newErrors.email = "El email es obligatorio";
      hasError = true;
    } else if (!validateEmail(email)) {
      newErrors.email = "Email inválido";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    setLoading(true);
    setError(null);

    try {
      // Generate unique IDs
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const personId = `P${Date.now()}`;

      // 1. Save session to IndexedDB
      await saveSession({
        sessionId,
        bill,
        people: [{
          id: personId,
          name: name.trim(),
          email: email.trim(),
          items: [], // Not used for single payment
          paid: false,
        }],
        createdAt: Date.now(),
      });

      // 2. Create payment with all bill items
      const products = bill.items.map(item => ({
        itemId: item.id,
        itemName: item.name,
        quantity: item.qty,
        unitPrice: item.unitPrice,
      }));

      const paymentId = await createPayment({
        sessionId,
        personId,
        personName: name.trim(),
        personEmail: email.trim(),
        amount: totalBill,
        currency: bill.currency,
        products,
      });

      // 3. Send email with payment link
      const origin = window.location.origin;
      const paymentLink = `${origin}/payment/link/${paymentId}`;

      const emailParams = {
        personName: name.trim(),
        tableName: bill.table.name,
        tableId: bill.table.id,
        server: bill.table.server,
        products: bill.items.map(item => ({
          name: item.name,
          quantity: item.qty,
          unitPrice: item.unitPrice,
          subtotal: item.qty * item.unitPrice,
        })),
        total: totalBill,
        currency: bill.currency,
        paymentLink,
      };

      const emailHtml = generatePaymentEmail(emailParams);

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email.trim(),
          subject: `💳 Pago pendiente - ${bill.table.name} (${totalBill.toFixed(2)} ${bill.currency})`,
          html: emailHtml,
          paymentLink,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el correo");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);

    } catch (err) {
      console.error("Error:", err);
      setError("Error al procesar la solicitud. Por favor, intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Warning section */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 4,
          textAlign: "center",
          bgcolor: "warning.light",
          border: "2px solid",
          borderColor: "warning.main",
        }}
      >
        <WarningIcon
          sx={{ fontSize: { xs: 48, sm: 64 }, color: "warning.main", mb: 2 }}
        />
        <Typography variant="body1" color="text.secondary" mb={2}>
          Revisa cuidadosamente toda la información. Se enviará un correo electrónico con el enlace de pago por el monto total de <strong>{totalBill.toFixed(2)} {bill.currency}</strong>.
        </Typography>
      </Paper>

      {/* Bill details */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <ReceiptIcon color="primary" />
          <Typography variant="h6">
            Detalles de la cuenta
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Mesa: {bill.table.name} ({bill.table.id})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Atendido por: {bill.table.server}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Items table */}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell align="center">Cant.</TableCell>
              <TableCell align="right">Precio Unit.</TableCell>
              <TableCell align="right">Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bill.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Typography variant="body2">{item.name}</Typography>
                  {item.notes && (
                    <Typography variant="caption" color="text.secondary">
                      {item.notes}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">{item.qty}</TableCell>
                <TableCell align="right">
                  {item.unitPrice.toFixed(2)} {bill.currency}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {(item.qty * item.unitPrice).toFixed(2)} {bill.currency}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />

        {/* Total */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h5" color="primary" fontWeight="bold">
            {totalBill.toFixed(2)} {bill.currency}
          </Typography>
        </Box>
      </Paper>

      {/* Contact form */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tus datos
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Te enviaremos un correo con el enlace para realizar el pago
        </Typography>

        <TextField
          fullWidth
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />
      </Paper>

      {/* Status messages */}
      <StatusAlert
        error={error}
        success={success}
        successMessage="¡Correo enviado exitosamente! Redirigiendo..."
      />

      {/* Navigation */}
      <Box display="flex" justifyContent="space-between" gap={2}>
        <Button
          variant="outlined"
          onClick={() => router.push("/")}
          disabled={loading || success}
          sx={{ flex: 1 }}
        >
          Volver
        </Button>
        <LoadingButton
          variant="contained"
          onClick={handleConfirmAndSendEmail}
          disabled={success}
          loading={loading}
          loadingText="Enviando..."
          sx={{ flex: 1 }}
        >
          Confirmar
        </LoadingButton>
      </Box>
    </Box>
  );
};
