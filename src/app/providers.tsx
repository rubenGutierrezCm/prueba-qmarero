/**
 * Theme and cache providers for the application
 * Wraps children with Material-UI ThemeProvider, CssBaseline, Emotion cache, and i18n
 */
"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import { emotionCache } from "@/theme/emotion-cache";
import { theme } from "@/theme/theme";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n/config';
import { useEffect, useState } from "react";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isI18nInitialized, setIsI18nInitialized] = useState(i18n.isInitialized);

  useEffect(() => {
    // Ensure i18n is initialized
    if (!i18n.isInitialized) {
      const handleInitialized = () => {
        setIsI18nInitialized(true);
      };
      i18n.on('initialized', handleInitialized);
      
      return () => {
        i18n.off('initialized', handleInitialized);
      };
    }
  }, []);

  if (!isI18nInitialized) {
    return null; // or a loading spinner
  }

  return (
    <I18nextProvider i18n={i18n}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </CacheProvider>
    </I18nextProvider>
  );
}
