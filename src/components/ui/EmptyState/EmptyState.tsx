/**
 * EmptyState - Reusable empty state component
 * Displays icon, title and description when no content is available
 */
"use client";

import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

/**
 * Props for the EmptyState component
 */
interface EmptyStateProps {
  /** Icon or illustration to display */
  icon: ReactNode;
  /** Main heading text */
  title: string;
  /** Optional description text */
  description?: string;
}

export const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
  return (
    <Box textAlign="center" py={{ xs: 4, sm: 6 }}>
      <Box sx={{ fontSize: { xs: 48, sm: 64 }, color: "text.secondary", mb: 2 }}>
        {icon}
      </Box>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" mb={3}>
          {description}
        </Typography>
      )}
    </Box>
  );
};
