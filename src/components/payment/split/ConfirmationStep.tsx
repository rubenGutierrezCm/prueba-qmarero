"use client";

import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import WarningIcon from "@mui/icons-material/Warning";
import { PersonSplit } from "@/types/bill";

interface ConfirmationStepProps {
  people: PersonSplit[];
  totalBill: number;
  currency: string;
  calculatePersonTotal: (person: PersonSplit) => number;
  onBack: () => void;
  onProceed: () => void;
}

export const ConfirmationStep = ({
  people,
  totalBill,
  currency,
  calculatePersonTotal,
  onBack,
  onProceed,
}: ConfirmationStepProps) => {
  return (
    <Box>
      <Paper elevation={1} sx={{ p: { xs: 2, sm: 4 }, textAlign: "center" }}>
        <WarningIcon
          sx={{ fontSize: { xs: 48, sm: 64 }, color: "warning.main", mb: 2 }}
        />
        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Confirmación final
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Revisa cuidadosamente la división antes de continuar
        </Typography>

        <Paper
          variant="outlined"
          sx={{ p: { xs: 2, sm: 3 }, mb: 3, bgcolor: "background.default" }}
        >
          <Typography variant="h6" gutterBottom>
            Resumen de la división
          </Typography>
          <Divider sx={{ my: 2 }} />

          {people.map((person) => {
            const personTotal = calculatePersonTotal(person);
            return (
              <Box
                key={person.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                  px: { xs: 1, sm: 2 },
                  mb: 1,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <PersonIcon color="primary" />
                  <Typography variant="body1" fontWeight="medium">
                    {person.name}
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  {personTotal.toFixed(2)} {currency}
                </Typography>
              </Box>
            );
          })}

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between" px={{ xs: 1, sm: 2 }} flexWrap="wrap" gap={1}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" color="primary">
              {totalBill.toFixed(2)} {currency}
            </Typography>
          </Box>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 4,
            bgcolor: "warning.light",
            border: "2px solid",
            borderColor: "warning.main",
          }}
        >
          <Box display="flex" gap={2} alignItems="flex-start" flexDirection={{ xs: 'column', sm: 'row' }}>
            <WarningIcon color="warning" sx={{ mt: { xs: 0, sm: 0.5 } }} />
            <Box textAlign="left">
              <Typography variant="subtitle1" fontWeight="bold">
                Importante
              </Typography>
              <Typography variant="body2">
                Una vez que procedas con el pago, no podrás cancelar ni
                modificar la división. Asegúrate de que todo está correcto.
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
          justifyContent="center"
        >
          <Button
            variant="outlined"
            size="large"
            onClick={onBack}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Volver a editar
          </Button>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={onProceed}
            sx={{ width: { xs: "100%", sm: 200 } }}
          >
            Proceder al pago
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
