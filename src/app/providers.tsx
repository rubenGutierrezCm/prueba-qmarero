/**
 * Theme and cache providers for the application
 * Wraps children with Material-UI ThemeProvider, CssBaseline, and Emotion cache
 */
"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import { emotionCache } from "@/theme/emotion-cache";
import { theme } from "@/theme/theme";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
