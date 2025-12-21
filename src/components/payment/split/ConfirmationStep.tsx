"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import WarningIcon from "@mui/icons-material/Warning";
import { PersonSplit } from "@/types/bill";
import { saveSession, createPayment } from "@/lib/indexeddb";
import { Bill } from "@/types/bill";

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
      // 1. Guardar sesión en IndexedDB
      await saveSession({
        sessionId,
        bill,
        people: people.map(p => ({ ...p, paid: false })),
        createdAt: Date.now(),
      });

      // 2. Crear pagos individuales para cada persona
      const paymentIds: string[] = [];
      for (const person of people) {
        const personTotal = calculatePersonTotal(person);
        
        // Obtener detalles de productos para esta persona
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

      // 3. Enviar correos a cada persona
      const origin = window.location.origin;
      const emailPromises = people.map((person, index) => {
        const paymentId = paymentIds[index];
        const personTotal = calculatePersonTotal(person);
        const paymentLink = `${origin}/payment/link/${paymentId}`;

        const products = person.items.map(item => {
          const billItem = bill.items.find(bi => bi.id === item.itemId);
          return `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${billItem?.name}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${(billItem?.unitPrice || 0).toFixed(2)} ${currency}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${((billItem?.unitPrice || 0) * item.quantity).toFixed(2)} ${currency}</td>
            </tr>
          `;
        }).join('');

        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Solicitud de pago - Qmarero</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Qmarero</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">División de Cuenta</p>
              </div>
              
              <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #667eea; margin-top: 0;">Hola ${person.name},</h2>
                
                <p style="font-size: 16px;">Se ha dividido una cuenta del restaurante <strong>${bill.table.name}</strong> (Mesa ${bill.table.id}) y tienes un pago pendiente.</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                  <h3 style="margin-top: 0; color: #667eea;">Tus productos:</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                      <tr style="background: #f5f5f5;">
                        <th style="padding: 10px; text-align: left; border-bottom: 2px solid #667eea;">Producto</th>
                        <th style="padding: 10px; text-align: center; border-bottom: 2px solid #667eea;">Cant.</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 2px solid #667eea;">Precio</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 2px solid #667eea;">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${products}
                    </tbody>
                  </table>
                  <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #667eea; text-align: right;">
                    <p style="margin: 0; font-size: 20px;">
                      <strong>Total a pagar:</strong> 
                      <span style="color: #667eea; font-size: 24px;">${personTotal.toFixed(2)} ${currency}</span>
                    </p>
                  </div>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${paymentLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                    💳 Pagar Ahora
                  </a>
                </div>
                
                <p style="font-size: 14px; color: #666; margin-top: 30px;">
                  <strong>Nota:</strong> Este enlace es único y personal. Haz clic en el botón para completar tu pago de forma segura.
                </p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
                  <p>Atendido por: ${bill.table.server}</p>
                  <p>© 2025 Qmarero - Sistema de división de cuentas</p>
                </div>
              </div>
            </body>
          </html>
        `;

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
      <Paper elevation={1} sx={{ p: { xs: 2, sm: 4 }, textAlign: "center" }}>
        <WarningIcon
          sx={{ fontSize: { xs: 48, sm: 64 }, color: "warning.main", mb: 2 }}
        />
        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Confirmación final
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Revisa cuidadosamente la división antes de continuar
        </Typography>

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

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 4,
            bgcolor: "warning.light",
            border: "2px solid",
            borderColor: "warning.main",
          }}
        >
          <Box display="flex" gap={2} alignItems="flex-start" flexDirection={{ xs: 'column', sm: 'row' }}>
            <WarningIcon color="warning" sx={{ mt: { xs: 0, sm: 0.5 } }} />
            <Box textAlign="left">
              <Typography variant="subtitle1" fontWeight="bold">
                Importante
              </Typography>
              <Typography variant="body2">
                Se enviará un correo electrónico a cada persona con un enlace único para realizar su pago.
                Asegúrate de que todos los correos sean correctos.
              </Typography>
            </Box>
          </Box>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            ¡Correos enviados exitosamente! Cada persona recibirá su enlace de pago.
          </Alert>
        )}

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
          justifyContent="center"
        >
          <Button
            variant="outlined"
            size="large"
            onClick={onBack}
            disabled={loading || success}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Volver a editar
          </Button>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={handleConfirmAndSendEmails}
            disabled={loading || success}
            sx={{ width: { xs: "100%", sm: 200 } }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : success ? (
              "✓ Enviados"
            ) : (
              "Enviar correos"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
