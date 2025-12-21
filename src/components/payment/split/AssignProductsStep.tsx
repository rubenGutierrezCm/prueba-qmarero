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
      <Typography variant="body2" color="text.secondary" gutterBottom>
          *Haz clic en cada producto para asignarlo a las personas
        </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 3,
        }}
      >
        {/* Lista de Items */}
        <Box>
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
        </Box>

        {/* Personas y División */}
        <Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" textAlign="center" gutterBottom>
              Resumen por persona
            </Typography>

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
          </Box>

          {/* Resumen */}
          <Paper elevation={2} sx={{ p: 2 }}>
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
          </Paper>

           <Box display="flex" justifyContent="space-between" mt={3}>
              <Button
                variant="outlined"
                onClick={onBack}
              >
                Volver
              </Button>
              <Button
                variant="contained"
                onClick={onContinue}
                disabled={!canProceed}
              >
                Continuar
              </Button>
            </Box>
        </Box>
      </Box>
    </Box>
  );
};
