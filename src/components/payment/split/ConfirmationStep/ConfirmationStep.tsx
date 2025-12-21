/**
 * ConfirmationStep - Final step of bill splitting wizard
 * Saves data to IndexedDB and sends payment emails to all people
 */
"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import WarningIcon from "@mui/icons-material/Warning";
import { PersonSplit } from "@/types/bill";
import { saveSession, createPayment } from "@/lib/indexeddb";
import { Bill } from "@/types/bill";
import { generatePaymentEmail, createEmailParams } from "@/lib/emailTemplate";
import { StatusAlert } from "@/components/ui";

interface ConfirmationStepProps {
  people: PersonSplit[];
  totalBill: number;
  currency: string;
  bill: Bill;
  sessionId: string;
  calculatePersonTotal: (person: PersonSplit) => number;
  onBack: () => void;
  onProceed: () => void;
}

export const ConfirmationStep = ({
  people,
  totalBill,
  currency,
  bill,
  sessionId,
  calculatePersonTotal,
  onBack,
  onProceed,
}: ConfirmationStepProps) => {
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

      // 2. Create individual payments for each person
      const paymentIds: string[] = [];
      for (const person of people) {
        const personTotal = calculatePersonTotal(person);
        
        // Get product details for this person
        const products = person.items.map(item => {
          const billItem = bill.items.find(bi => bi.id === item.itemId);
          return {
            itemId: item.itemId,
            itemName: billItem?.name || "Producto desconocido",
            quantity: item.quantity,
            unitPrice: billItem?.unitPrice || 0,
          };
        });

        const paymentId = await createPayment({
          sessionId,
          personId: person.id,
          personName: person.name,
          personEmail: person.email,
          amount: personTotal,
          currency,
          products,
        });

        paymentIds.push(paymentId);
      }

      // 3. Send emails to each person
      const origin = window.location.origin;
      const emailPromises = people.map((person, index) => {
        const paymentId = paymentIds[index];
        const personTotal = calculatePersonTotal(person);
        const paymentLink = `${origin}/payment/link/${paymentId}`;

        // Generate email using template utility
        const emailParams = createEmailParams(person, bill, personTotal, paymentLink);
        const emailHtml = generatePaymentEmail(emailParams);

        return fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: person.email,
            subject: `💳 Pago pendiente - ${bill.table.name} (${personTotal.toFixed(2)} ${currency})`,
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
          sx={{ fontSize: { xs: 48, sm: 64 }, color: "warning", mb: 2 }}
        />
        <Typography variant="body1" color="text.secondary" mb={4}>
          Revisa cuidadosamente toda la información, se enviará
           un correo electrónico a cada persona con su enlace de 
           pago.
        </Typography>
        </Paper>
        <Paper
          variant="outlined"
          sx={{ p: { xs: 2, sm: 3 }, mb: 3, bgcolor: "background.default" }}
        >
          <Typography variant="h6" gutterBottom>
            Resumen de la división
          </Typography>
          <Divider sx={{ my: 2 }} />

          {people.map((person) => {
            const personTotal = calculatePersonTotal(person);
            return (
              <Box
                key={person.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                  px: { xs: 1, sm: 2 },
                  mb: 1,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <PersonIcon color="primary" />
                  <Typography variant="body1" fontWeight="medium">
                    {person.name}
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  {personTotal.toFixed(2)} {currency}
                </Typography>
              </Box>
            );
          })}

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between" px={{ xs: 1, sm: 2 }} flexWrap="wrap" gap={1}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" color="primary">
              {totalBill.toFixed(2)} {currency}
            </Typography>
          </Box>
        </Paper>

        <StatusAlert
          error={error}
          success={success}
          successMessage="¡Correos enviados exitosamente! Cada persona recibirá su enlace de pago."
        />

        <Box
          display="flex"
          gap={2}
          justifyContent="space-between"
        >
          <Button
            variant="outlined"
            onClick={onBack}
            disabled={loading || success}
          >
            Volver
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmAndSendEmails}
            disabled={loading || success}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : success ? (
              "✓ Enviados"
            ) : (
              "Confirmar"
            )}
          </Button>
        </Box>
    </Box>
  );
};
