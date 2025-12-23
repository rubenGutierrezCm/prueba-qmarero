/**
 * PersonCard - Reusable card component to display person information
 * Used across different steps to show consistent person UI
 */
"use client";

import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * Props for the PersonCard component
 */
interface PersonCardProps {
  /** Person's name */
  name: string;
  /** Person's email address */
  email: string;
  /** Callback function when delete button is clicked */
  onDelete?: () => void;
  /** Optional child elements to render below email */
  children?: React.ReactNode;
}

export const PersonCard = ({ name, email, onDelete, children }: PersonCardProps) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <PersonIcon color="primary" />
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                {name}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                {email}
              </Typography>
            </Box>
            {children}
          </Box>
          {onDelete && (
            <IconButton size="small" onClick={onDelete} color="error">
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
