/**
 * PaymentMethodHeader - Header component for payment pages
 * Displays table info and total bill amount
 */
import { getTotalBill, MOCK_BILL } from "@/lib/mockBill";
import { Box, Container, Paper, Typography } from "@mui/material";

/**
 * Props for PaymentMethodHeader component
 */
interface IPaymentMethodHeaderProps {
  /** Child components to render below header */
  children: React.ReactNode;
  /** Title to display in header */
  title: string;
}

export const PaymentMethodHeader = ({
  children,
  title
}: IPaymentMethodHeaderProps) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box>
          <Typography variant="h4" align="center" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {MOCK_BILL.table.name} • Mesa {MOCK_BILL.table.id}
          </Typography>
          <Box display="flex" alignItems="center" gap="10px">
            <Typography variant="body2" color="text.secondary">
              Total cuenta:
            </Typography>
            <Typography fontWeight="bold">
              {getTotalBill(MOCK_BILL).toFixed(2)} {MOCK_BILL.currency}
            </Typography>
          </Box>
        </Box>
      </Paper>
      {children}
    </Container>
  );
};
