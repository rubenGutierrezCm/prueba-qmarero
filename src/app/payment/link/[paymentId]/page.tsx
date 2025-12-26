/**
 * Payment link page - Individual payment processing
 * Displays payment details and Stripe payment form for a specific person
 */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getPayment, markPaymentAsPaid, loadSession } from "@/lib/indexeddb";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { LoadingButton, StatusAlert } from "@/components/ui";
import { useTranslation } from 'react-i18next';
import { generateConfirmationEmail } from "@/lib/emailTemplate";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface PaymentData {
  paymentId: string;
  sessionId: string;
  personId: string;
  personName: string;
  personEmail: string;
  amount: number;
  currency: string;
  products: {
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
  }[];
  paid: boolean;
  paymentIntentId?: string;
  paidAt?: number;
  createdAt: number;
}

const PaymentFormContent = ({
  paymentData,
  onSuccess,
}: {
  paymentData: PaymentData;
  clientSecret: string;
  onSuccess: () => void;
}) => {
  const { t, i18n } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || t('payment.errorProcessing'));
        setLoading(false);
        return;
      }

      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (result.error) {
        setError(result.error.message || t('payment.errorProcessing'));
        setLoading(false);
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        // Mark as paid in IndexedDB
        await markPaymentAsPaid(paymentData.paymentId, result.paymentIntent.id);
        
        // Send confirmation email
        try {
          const session = await loadSession(paymentData.sessionId);
          
          if (session) {
            const confirmationHtml = generateConfirmationEmail({
              personName: paymentData.personName,
              personEmail: paymentData.personEmail,
              tableName: session.bill.table.name,
              tableId: session.bill.table.id,
              server: session.bill.table.server,
              products: paymentData.products.map(p => ({
                name: p.itemName,
                quantity: p.quantity,
                unitPrice: p.unitPrice,
                subtotal: p.unitPrice * p.quantity,
              })),
              total: paymentData.amount,
              currency: paymentData.currency,
              transactionId: result.paymentIntent.id,
              paidAt: new Date().toLocaleString(),
              language: i18n.language,
            });

            await fetch("/api/send-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: paymentData.personEmail,
                subject: "✅ Confirmación de Pago - QMarero",
                html: confirmationHtml,
              }),
            });
          }
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
          // Don't fail the payment if email fails
        }
        
        onSuccess();
      } else {
        setLoading(false);
      }
    } catch {
      setError(t('payment.errorProcessing'));
      setLoading(false);
    }
  };

  return (
    <Box>
      <PaymentElement />
      <StatusAlert error={error} sx={{ mt: 2 }} />
      <LoadingButton
        size="large"
        fullWidth
        onClick={handleSubmit}
        disabled={!stripe}
        loading={loading}
        loadingText={t('common.sending')}
        sx={{ mt: 3 }}
      >
        {t('common.confirm')} {paymentData.amount.toFixed(2)} {paymentData.currency}
      </LoadingButton>
    </Box>
  );
};

export default function PaymentLinkPage() {
  const { t } = useTranslation();
  const params = useParams();
  const paymentId = params.paymentId as string;

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const loadPaymentData = async () => {
      try {
        const payment = await getPayment(paymentId);
        
        if (!payment) {
          setError(t('payment.errorProcessing'));
          setLoading(false);
          return;
        }

        if (payment.paid) {
          setPaymentSuccess(true);
          setPaymentData(payment);
          setLoading(false);
          return;
        }

        setPaymentData(payment);

        // Create payment intent
        const response = await fetch("/api/stripe/payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(payment.amount * 100),
            currency: payment.currency.toLowerCase(),
          }),
        });

        if (!response.ok) {
          throw new Error(t('payment.errorProcessing'));
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Error:", err);
        setError(t('payment.errorProcessing'));
      } finally {
        setLoading(false);
      }
    };

    loadPaymentData();
  }, [paymentId, t]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box textAlign="center">
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {t('common.loading')}
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <StatusAlert error={error} />
      </Container>
    );
  }

  if (paymentSuccess && paymentData) {
    return (
      <Container 
        maxWidth="md" 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper elevation={0} sx={{ p: 4, textAlign: "center" }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            {t('success.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            {t('success.description')}
          </Typography>
          {paymentData.paidAt && (
            <Typography variant="body2" color="text.secondary">
              {new Date(paymentData.paidAt).toLocaleString()}
            </Typography>
          )}
        </Paper>
      </Container>
    );
  }

  if (!paymentData || !clientSecret) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, mt: 3, textAlign: "center", fontWeight: "bold" }}>
          {t('payment.fullBillPayment')}
        </Typography>

        {/* Payment details */}
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mb: 3, mt: 3, bgcolor: "background.default" }}>
          <Typography variant="h6" gutterBottom>
            {t('payment.finalSummary')}
          </Typography>
          
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: { xs: 300, sm: 500 } }}>
              <TableHead>
                <TableRow>
                  <TableCell>{t('products.product')}</TableCell>
                  <TableCell align="center">{t('products.quantity')}</TableCell>
                  <TableCell align="right">{t('products.unitPrice')}</TableCell>
                  <TableCell align="right">{t('products.subtotal')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentData.products.map((product) => (
                  <TableRow key={product.itemId}>
                    <TableCell sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>{product.itemName}</TableCell>
                    <TableCell align="center">{product.quantity}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      {product.unitPrice.toFixed(2)} {paymentData.currency}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      {(product.unitPrice * product.quantity).toFixed(2)} {paymentData.currency}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
            <Typography variant="h6">{t('bill.totalBill')}:</Typography>
            <Typography variant="h5" color="primary" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              {paymentData.amount.toFixed(2)} {paymentData.currency}
            </Typography>
          </Box>
        </Paper>

        {/* Formulario de pago */}
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: { theme: "stripe" },
          }}
        >
          <PaymentFormContent
            paymentData={paymentData}
            clientSecret={clientSecret}
            onSuccess={handlePaymentSuccess}
          />
        </Elements>
    </Container>
  );
}
