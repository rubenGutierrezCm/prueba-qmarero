/**
 * Home page - Barcode entry form
 * Allows users to enter their table barcode to access payment options
 */
"use client";

import { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { LanguageSwitch } from "@/components/Shared";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [barcode, setBarcode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!barcode.trim()) {
      setError(t('home.barcodeRequired'));
      return;
    }

    // Navigate to the barcode page
    router.push(`/${barcode.trim()}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        position: "relative",
      }}
    >
      {/* Language Switch - Top Right */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
        }}
      >
        <LanguageSwitch />
      </Box>

      <Box sx={{ width: "100%", maxWidth: 480 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <QrCodeScannerIcon
              sx={{
                fontSize: 80,
                color: "primary.main",
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: 600, mb: 1 }}
          >
            {t('home.welcomeTitle')}
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            {t('home.welcomeSubtitle')}
          </Typography>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('home.barcodeLabel')}
              placeholder={t('home.barcodePlaceholder')}
              value={barcode}
              onChange={(e) => {
                setBarcode(e.target.value);
                setError("");
              }}
              error={!!error}
              helperText={error}
              sx={{ mb: 3 }}
              autoFocus
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ py: 1.5 }}
            >
              {t('home.continueButton')}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
