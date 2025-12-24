/**
 * Payment options page - Dynamic route based on barcode
 * Allows users to choose between single payment, equal split, or custom split
 */
"use client";

import { Box, Button, Typography, Stack } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { LanguageSwitch } from "@/components/Shared";

export default function PaymentOptions() {
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();
  const code = params.code as string;

  const handleChangeRoute = (url: string) => {
    router.push(url);
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

      <Box sx={{ width: "100%", maxWidth: 420 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          {t('home.title')}
        </Typography>

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{ mb: 1 }}
        >
          {t('home.subtitle')}
        </Typography>

        {/* Show table code */}
        <Typography
          variant="caption"
          align="center"
          color="text.secondary"
          sx={{ mb: 3, display: "block" }}
        >
          {t('home.tableCode')}: <strong>{code}</strong>
        </Typography>

        <Stack spacing={2}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => handleChangeRoute("/payment/single")}
          >
            {t('home.paySingle')}
          </Button>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={() => handleChangeRoute("/payment/equal")}
          >
            {t('home.payEqual')}
          </Button>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={() => handleChangeRoute("/payment/split")}
          >
            {t('home.paySplit')}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
