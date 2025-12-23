/**
 * WarningBox - Reusable warning message component
 * Used to display important information before confirming actions
 */
"use client";

import { Paper, Typography, PaperProps } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import { ReactNode } from "react";

/**
 * Props for the WarningBox component
 */
interface WarningBoxProps extends Omit<PaperProps, 'variant'> {
  /** Warning message content */
  children: ReactNode;
}

export const WarningBox = ({ children, sx, ...props }: WarningBoxProps) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        mb: 4,
        textAlign: "center",
        bgcolor: "warning.light",
        border: "2px solid",
        borderColor: "warning.main",
        ...sx,
      }}
      {...props}
    >
      <WarningIcon
        sx={{ fontSize: { xs: 48, sm: 64 }, color: "warning.main", mb: 2 }}
      />
      <Typography variant="body1" color="text.secondary" mb={2}>
        {children}
      </Typography>
    </Paper>
  );
};
