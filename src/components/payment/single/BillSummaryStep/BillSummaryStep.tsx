/**
 * BillSummaryStep - Shows complete bill summary with items
 * Collects user email and sends payment link directly
 */
"use client";

import ReceiptIcon from "@mui/icons-material/Receipt";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { processSinglePayment } from "@/lib/paymentService";
import { TextField, WarningBox } from "@/components/Shared";
import { getTotalBill, MOCK_BILL } from "@/lib/mockBill";
import { LoadingButton, StatusAlert } from "@/components/ui";
import { personSchema, PersonFormData } from "@/lib/validationSchemas";
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  Button,
} from "@mui/material";

const CURRENT_BILL = MOCK_BILL;

export const BillSummaryStep = () => {

  const { t } = useTranslation();
  const router = useRouter();

  const totalBill = useMemo(() => getTotalBill(CURRENT_BILL), []);

  const { control, handleSubmit, formState: { errors } } = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      name: "",
      email: "",
    },
    mode: "onBlur",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: PersonFormData) => {

    setLoading(true);
    setError(null);

    try {
      // Process payment using reusable service
      await processSinglePayment({
        bill: CURRENT_BILL,
        personName: data.name.trim(),
        personEmail: data.email.trim(),
        totalAmount: totalBill,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/email/sent?method=single");
      }, 2000);

    } catch (err) {
      console.error("Error:", err);
      setError(t('payment.errorProcessing'));
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Warning section */}
      <WarningBox>
        {t('payment.reviewInfo')}
      </WarningBox>

      {/* Bill details */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <ReceiptIcon color="primary" />
          <Typography variant="h6">
            {t('bill.details')}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t('bill.table')}: {CURRENT_BILL.table.name} ({CURRENT_BILL.table.id})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('bill.servedBy')}: {CURRENT_BILL.table.server}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Items table */}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('products.product')}</TableCell>
              <TableCell align="center">{t('products.quantity')}</TableCell>
              <TableCell align="right">{t('products.unitPrice')}</TableCell>
              <TableCell align="right">{t('products.subtotal')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {CURRENT_BILL.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Typography variant="body2">{item.name}</Typography>
                </TableCell>
                <TableCell align="center">{item.qty}</TableCell>
                <TableCell align="right">
                  {item.unitPrice.toFixed(2)} {CURRENT_BILL.currency}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {(item.qty * item.unitPrice).toFixed(2)} {CURRENT_BILL.currency}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />

        {/* Total */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{t('bill.totalBill')}:</Typography>
          <Typography variant="h5" color="primary" fontWeight="bold">
            {totalBill.toFixed(2)} {CURRENT_BILL.currency}
          </Typography>
        </Box>
      </Paper>

      {/* Contact form */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('payment.yourInfo')}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          {t('payment.sendEmailMessage')}
        </Typography>

        <TextField
          name="name"
          control={control}
          errors={errors}
          fullWidth
          label={t('people.fullName')}
          sx={{ mb: 2 }}
          disabled={loading || success}
        />

        <TextField
          name="email"
          control={control}
          errors={errors}
          fullWidth
          label={t('people.email')}
          type="email"
          disabled={loading || success}
        />
      </Paper>

      {/* Status messages */}
      <StatusAlert
        error={error}
        success={success}
        successMessage={t('payment.emailSentSuccess')}
      />

      {/* Navigation */}
      <Box display="flex" justifyContent="space-between" gap={2}>
        <Button
          variant="outlined"
          onClick={() => router.push("/")}
          disabled={loading || success}
          sx={{ flex: 1 }}
        >
          {t('common.back')}
        </Button>
        <LoadingButton
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={success}
          loading={loading}
          loadingText={t('common.sending')}
          sx={{ flex: 1 }}
        >
          {t('common.confirm')}
        </LoadingButton>
      </Box>
    </Box>
  );
};
