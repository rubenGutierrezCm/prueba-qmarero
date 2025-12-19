"use client";

import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import { Bill, PersonSplit } from "@/types/bill";

interface AssignProductsStepProps {
  bill: Bill;
  people: PersonSplit[];
  totalBill: number;
  getTotalAssigned: () => number;
  getItemAssignedQty: (itemId: string) => number;
  calculatePersonTotal: (person: PersonSplit) => number;
  onOpenQuickAssign: (itemId: string) => void;
  onRemoveItemFromPerson: (personId: string, itemId: string) => void;
  onBack: () => void;
  onContinue: () => void;
  canProceed: boolean;
}

export const AssignProductsStep = ({
  bill,
  people,
  totalBill,
  getTotalAssigned,
  getItemAssignedQty,
  calculatePersonTotal,
  onOpenQuickAssign,
  onRemoveItemFromPerson,
  onBack,
  onContinue,
  canProceed,
}: AssignProductsStepProps) => {
  return (
    <Box>
      <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Asignar productos
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Haz clic en cada producto para asignarlo a las personas
        </Typography>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 3,
        }}
      >
        {/* Lista de Items */}
        <Box>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Items de la cuenta
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {bill.items.map((item) => {
                const assignedQty = getItemAssignedQty(item.id);
                const remainingQty = item.qty - assignedQty;
                return (
                  <ListItem
                    key={item.id}
                    sx={{
                      mb: 1,
                      bgcolor:
                        remainingQty === 0
                          ? "success.light"
                          : "background.paper",
                      borderRadius: 1,
                      border: 1,
                      borderColor: "divider",
                      cursor: "pointer",
                      flexDirection: "column",
                      alignItems: "stretch",
                      p: { xs: 1.5, sm: 2 },
                      "&:hover": {
                        bgcolor:
                          remainingQty === 0
                            ? "success.light"
                            : "action.hover",
                      },
                    }}
                    onClick={() => onOpenQuickAssign(item.id)}
                  >
                    <ListItemText
                      primary={
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          flexWrap="wrap"
                          gap={1}
                        >
                          <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body1" fontWeight="bold" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            {(item.qty * item.unitPrice).toFixed(2)}{" "}
                            {bill.currency}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          {item.qty} x {item.unitPrice.toFixed(2)}{" "}
                          {bill.currency}
                          {item.notes && (
                            <>
                              <br />
                              <Typography
                                variant="caption"
                                component="span"
                                color="text.secondary"
                              >
                                {item.notes}
                              </Typography>
                            </>
                          )}
                        </>
                      }
                      secondaryTypographyProps={{ component: "div" }}
                    />
                    <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
                      <Chip
                        size="small"
                        label={`${assignedQty}/${item.qty} asignado`}
                        color={remainingQty === 0 ? "success" : "default"}
                      />
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Box>

        {/* Personas y División */}
        <Box>
          <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resumen por persona
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box>
              {people.map((person) => {
                const personTotal = calculatePersonTotal(person);
                return (
                  <Card key={person.id} sx={{ mb: 2 }}>
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                        flexWrap="wrap"
                        gap={1}
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <PersonIcon color="primary" />
                          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                            {person.name}
                          </Typography>
                        </Box>
                        <Typography variant="h6" color="primary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                          {personTotal.toFixed(2)} {bill.currency}
                        </Typography>
                      </Box>
                      {person.items.length > 0 ? (
                        <List dense>
                          {person.items.map((item) => {
                            const billItem = bill.items.find(
                              (bi) => bi.id === item.itemId
                            );
                            if (!billItem) return null;
                            return (
                              <ListItem
                                key={item.itemId}
                                secondaryAction={
                                  <IconButton
                                    edge="end"
                                    size="small"
                                    onClick={() =>
                                      onRemoveItemFromPerson(
                                        person.id,
                                        item.itemId
                                      )
                                    }
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                }
                                sx={{ px: 0 }}
                              >
                                <ListItemText
                                  primary={billItem.name}
                                  secondary={`${item.quantity} x ${billItem.unitPrice.toFixed(
                                    2
                                  )} = ${(
                                    item.quantity * billItem.unitPrice
                                  ).toFixed(2)} ${bill.currency}`}
                                  primaryTypographyProps={{ 
                                    sx: { fontSize: { xs: '0.875rem', sm: '1rem' }, pr: 4 } 
                                  }}
                                  secondaryTypographyProps={{ 
                                    sx: { fontSize: { xs: '0.75rem', sm: '0.875rem' } } 
                                  }}
                                />
                              </ListItem>
                            );
                          })}
                        </List>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Sin items asignados
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Paper>

          {/* Resumen */}
          <Paper elevation={2} sx={{ p: 2, bgcolor: "primary.light" }}>
            <Typography variant="h6" gutterBottom>
              Resumen
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Total cuenta:</Typography>
              <Typography fontWeight="bold">
                {totalBill.toFixed(2)} {bill.currency}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Total asignado:</Typography>
              <Typography
                fontWeight="bold"
                color={
                  getTotalAssigned() === totalBill
                    ? "success.dark"
                    : "error.dark"
                }
              >
                {getTotalAssigned().toFixed(2)} {bill.currency}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Pendiente:</Typography>
              <Typography fontWeight="bold">
                {(totalBill - getTotalAssigned()).toFixed(2)} {bill.currency}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={onBack}
              >
                Volver
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={onContinue}
                disabled={!canProceed}
              >
                Continuar
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};
