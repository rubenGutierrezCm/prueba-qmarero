/**
 * CenteredMessagePage - Full-page centered message component
 * Used for error states, success messages, and loading screens
 */
"use client";

import { Box, Container, Typography } from "@mui/material";
import { ReactNode } from "react";

interface CenteredMessagePageProps {
  /** Icon or image to display */
  icon: ReactNode;
  /** Main title/heading */
  title: string;
  /** Description text or custom content */
  description: string | ReactNode;
}

export const CenteredMessagePage = ({
  icon,
  title,
  description,
}: CenteredMessagePageProps) => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 3,
          width: "100%",
        }}
      >
        {icon}

        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>

        {typeof description === "string" ? (
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        ) : (
          description
        )}
      </Box>
    </Container>
  );
};
