/**
 * Payment link page - Individual payment processing
 * Displays payment details and Stripe payment form for a specific person
 */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { getPayment, markPaymentAsPaid } from "@/lib/indexeddb";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { LoadingButton, StatusAlert } from "@/components/ui";

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
        setError(submitError.message || "Error en el formulario");
        setLoading(false);
        return;
      }

      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (result.error) {
        setError(result.error.message || "Error en el pago");
        setLoading(false);
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        // Marcar como pagado en IndexedDB
        await markPaymentAsPaid(paymentData.paymentId, result.paymentIntent.id);
        onSuccess();
      } else {
        setLoading(false);
      }
    } catch {
      setError("Error inesperado al procesar el pago");
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
        loadingText="Procesando..."
        sx={{ mt: 3 }}
      >
        Pagar {paymentData.amount.toFixed(2)} {paymentData.currency}
      </LoadingButton>
    </Box>
  );
};

export default function PaymentLinkPage() {
  const params = useParams();
  const router = useRouter();
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
          setError("Pago no encontrado");
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

        // Crear payment intent
        const response = await fetch("/api/stripe/payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(payment.amount * 100),
            currency: payment.currency.toLowerCase(),
          }),
        });

        if (!response.ok) {
          throw new Error("Error al crear payment intent");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Error:", err);
        setError("Error al cargar los datos del pago");
      } finally {
        setLoading(false);
      }
    };

    loadPaymentData();
  }, [paymentId]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      router.push("/payment/success");
    }, 3000);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box textAlign="center">
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Cargando datos del pago...
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
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            ¡Pago completado!
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Gracias {paymentData.personName}, tu pago de{" "}
            <strong>
              {paymentData.amount.toFixed(2)} {paymentData.currency}
            </strong>{" "}
            ha sido procesado correctamente.
          </Typography>
          {paymentData.paidAt && (
            <Typography variant="body2" color="text.secondary">
              Pagado el {new Date(paymentData.paidAt).toLocaleString()}
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" gutterBottom>
          Pago Individual
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Hola {paymentData.personName}, completa tu pago aquí
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Detalles del pago */}
        <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: "background.default" }}>
          <Typography variant="h6" gutterBottom>
            Resumen de tu pago
          </Typography>
          
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell align="center">Cantidad</TableCell>
                <TableCell align="right">Precio Unit.</TableCell>
                <TableCell align="right">Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentData.products.map((product) => (
                <TableRow key={product.itemId}>
                  <TableCell>{product.itemName}</TableCell>
                  <TableCell align="center">{product.quantity}</TableCell>
                  <TableCell align="right">
                    {product.unitPrice.toFixed(2)} {paymentData.currency}
                  </TableCell>
                  <TableCell align="right">
                    {(product.unitPrice * product.quantity).toFixed(2)} {paymentData.currency}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h5" color="primary">
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
      </Paper>
    </Container>
  );
}
