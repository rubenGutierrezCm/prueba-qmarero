/**
 * EqualConfirmationStep - Final step for equal payment
 * Saves to IndexedDB and sends payment emails to all people
 */
"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { LoadingButton, StatusAlert } from "@/components/ui";
import PersonIcon from "@mui/icons-material/Person";
import WarningIcon from "@mui/icons-material/Warning";
import { PersonSplit, Bill } from "@/types/bill";
import { saveSession, createPayment } from "@/lib/indexeddb";
import { generatePaymentEmail } from "@/lib/emailTemplate";

interface EqualConfirmationStepProps {
  people: PersonSplit[];
  amountPerPerson: number;
  totalBill: number;
  currency: string;
  bill: Bill;
  sessionId: string;
  onBack: () => void;
  onProceed: () => void;
}

export const EqualConfirmationStep = ({
  people,
  amountPerPerson,
  totalBill,
  currency,
  bill,
  sessionId,
  onBack,
  onProceed,
}: EqualConfirmationStepProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleConfirmAndSendEmails = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Save session to IndexedDB
      await saveSession({
        sessionId,
        bill,
        people: people.map(p => ({ ...p, paid: false })),
        createdAt: Date.now(),
      });

      // 2. Create individual payments for each person (equal amounts)
      const paymentIds: string[] = [];
      for (const person of people) {
        // Create a summary product for equal split
        const products = [{
          itemId: 'equal-split',
          itemName: `Parte igual de la cuenta (${people.length} personas)`,
          quantity: 1,
          unitPrice: amountPerPerson,
        }];

        const paymentId = await createPayment({
          sessionId,
          personId: person.id,
          personName: person.name,
          personEmail: person.email,
          amount: amountPerPerson,
          currency,
          products,
        });

        paymentIds.push(paymentId);
      }

      // 3. Send emails to each person
      const origin = window.location.origin;
      const emailPromises = people.map((person, index) => {
        const paymentId = paymentIds[index];
        const paymentLink = `${origin}/payment/link/${paymentId}`;

        // Create email params for equal split
        const emailParams = {
          personName: person.name,
          tableName: bill.table.name,
          tableId: bill.table.id,
          server: bill.table.server,
          products: [{
            name: `División equitativa de la cuenta`,
            quantity: 1,
            unitPrice: amountPerPerson,
            subtotal: amountPerPerson,
          }],
          total: amountPerPerson,
          currency,
          paymentLink,
        };

        const emailHtml = generatePaymentEmail(emailParams);

        return fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: person.email,
            subject: `💳 Pago pendiente - ${bill.table.name} (${amountPerPerson.toFixed(2)} ${currency})`,
            html: emailHtml,
            paymentLink,
          }),
        });
      });

      await Promise.all(emailPromises);

      setSuccess(true);
      setTimeout(() => {
        onProceed();
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
          Revisa cuidadosamente toda la información. Se enviará un correo electrónico a cada persona con su enlace de pago por un monto igual de <strong>{amountPerPerson.toFixed(2)} {currency}</strong>.
        </Typography>
      </Paper>

      {/* Summary */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Resumen Final
        </Typography>
        
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body1">Total de la cuenta:</Typography>
          <Typography variant="body1" fontWeight="bold">
            {totalBill.toFixed(2)} {currency}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body1">Personas:</Typography>
          <Typography variant="body1" fontWeight="bold">
            {people.length}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6" color="primary">
            Por persona:
          </Typography>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {amountPerPerson.toFixed(2)} {currency}
          </Typography>
        </Box>
      </Paper>

      {/* People list */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Personas que recibirán el enlace de pago
        </Typography>
        
        <List>
          {people.map((person) => (
            <ListItem key={person.id}>
              <PersonIcon color="primary" sx={{ mr: 2 }} />
              <ListItemText
                primary={person.name}
                secondary={`${person.email} • ${amountPerPerson.toFixed(2)} ${currency}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Status messages */}
      <StatusAlert
        error={error}
        success={success}
        successMessage="¡Correos enviados exitosamente! Redirigiendo..."
      />

      {/* Actions */}
      <Box display="flex" justifyContent="space-between" gap={2}>
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={loading || success}
          sx={{ flex: 1 }}
        >
          Volver
        </Button>
        <LoadingButton
          onClick={handleConfirmAndSendEmails}
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
