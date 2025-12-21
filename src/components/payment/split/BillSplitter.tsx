"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@mui/material";
import { Bill, PersonSplit } from "@/types/bill";
import { PeopleStep } from "./PeopleStep";
import { AssignProductsStep } from "./AssignProductsStep";
import { ConfirmationStep } from "./ConfirmationStep";
import { QuickAssignDialog } from "./QuickAssignDialog";

interface BillSplitterProps {
  bill: Bill;
}

export const BillSplitter = ({ bill }: BillSplitterProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [people, setPeople] = useState<PersonSplit[]>([]);
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonEmail, setNewPersonEmail] = useState("");
  const [openAddPerson, setOpenAddPerson] = useState(false);
  const [openQuickAssign, setOpenQuickAssign] = useState(false);
  const [quickAssignItemId, setQuickAssignItemId] = useState("");
  const [quickAssignQuantities, setQuickAssignQuantities] = useState<
    Record<string, number | string>
  >({});
  
  // Generar sessionId único
  const [sessionId] = useState(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  });

  const handleAddPerson = () => {
    const newPerson: PersonSplit = {
      id: `P${Date.now()}`,
      name: newPersonName.trim(),
      email: newPersonEmail.trim(),
      items: [],
    };
    setPeople([...people, newPerson]);
    setNewPersonName("");
    setNewPersonEmail("");
    setOpenAddPerson(false);
  };

  // Validación para habilitar/deshabilitar el botón de añadir
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isNameValid = newPersonName.trim().length > 1;
  const isEmailValid = newPersonEmail.trim() !== "" && emailRegex.test(newPersonEmail.trim());
  const canAddPerson = isNameValid && isEmailValid;

  const handleRemovePerson = (personId: string) => {
    setPeople(people.filter((p) => p.id !== personId));
  };

  const handleRemoveItemFromPerson = (personId: string, itemId: string) => {
    setPeople(
      people.map((person) => {
        if (person.id === personId) {
          return {
            ...person,
            items: person.items.filter((i) => i.itemId !== itemId),
          };
        }
        return person;
      })
    );
  };

  const handleOpenQuickAssign = (itemId: string) => {
    if (people.length === 0) {
      alert("Primero debes añadir personas");
      return;
    }
    setQuickAssignItemId(itemId);
    
    // Pre-cargar las cantidades ya asignadas para este producto
    const existingQuantities: Record<string, number | string> = {};
    people.forEach((person) => {
      const personItem = person.items.find((i) => i.itemId === itemId);
      existingQuantities[person.id] = personItem?.quantity || '';
    });
    
    setQuickAssignQuantities(existingQuantities);
    setOpenQuickAssign(true);
  };

  const handleQuickAssign = () => {
    setPeople(
      people.map((person) => {
        const quantity = typeof quickAssignQuantities[person.id] === 'number' 
          ? quickAssignQuantities[person.id] as number
          : 0;
        
        // Remover el item si la cantidad es 0, o actualizar/agregar si es mayor a 0
        const existingItemIndex = person.items.findIndex(
          (i) => i.itemId === quickAssignItemId
        );
        
        if (quantity === 0) {
          // Si la cantidad es 0, eliminar el item
          if (existingItemIndex >= 0) {
            return {
              ...person,
              items: person.items.filter((i) => i.itemId !== quickAssignItemId),
            };
          }
          return person;
        } else {
          // Si la cantidad es mayor a 0, actualizar o agregar
          if (existingItemIndex >= 0) {
            const updatedItems = [...person.items];
            updatedItems[existingItemIndex].quantity = quantity;
            return { ...person, items: updatedItems };
          } else {
            return {
              ...person,
              items: [
                ...person.items,
                { itemId: quickAssignItemId, quantity },
              ],
            };
          }
        }
      })
    );
    setOpenQuickAssign(false);
    setQuickAssignItemId("");
    setQuickAssignQuantities({});
  };

  const handleQuickAssignQuantityChange = (
    personId: string,
    value: number | string
  ) => {
    setQuickAssignQuantities((prev) => ({
      ...prev,
      [personId]: value === '' ? '' : Math.max(0, Number(value)),
    }));
  };

  const calculatePersonTotal = (person: PersonSplit): number => {
    return person.items.reduce((sum, item) => {
      const billItem = bill.items.find((bi) => bi.id === item.itemId);
      if (billItem) {
        return sum + billItem.unitPrice * item.quantity;
      }
      return sum;
    }, 0);
  };

  const getItemAssignedQty = (itemId: string): number => {
    return people.reduce((sum, person) => {
      const personItem = person.items.find((i) => i.itemId === itemId);
      return sum + (personItem?.quantity || 0);
    }, 0);
  };

  const getTotalAssigned = (): number => {
    return people.reduce(
      (sum, person) => sum + calculatePersonTotal(person),
      0
    );
  };

  const totalBill = bill.items.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  );

  const canProceedToStep3 = getTotalAssigned() === totalBill;

  const steps = [
    { label: "Configurar personas" },
    { label: "Asignar productos" },
    { label: "Confirmar división" },
  ];

  return (
    <Box>
      {/* Stepper */}
      <Box sx={{ mb: 3 }}>
        <Stepper activeStep={activeTab} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.label} completed={activeTab > index}>
              <StepLabel />
            </Step>
          ))}
        </Stepper>
        
        {/* Descripción del paso actual */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {steps[activeTab].label}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 1, sm: 2, md: 0 } }}>
        {activeTab === 0 && (
          <PeopleStep
            people={people}
            onAddPerson={() => setOpenAddPerson(true)}
            onRemovePerson={handleRemovePerson}
          onContinue={() => setActiveTab(1)}
        />
      )}

      {activeTab === 1 && (
        <AssignProductsStep
          bill={bill}
          people={people}
          totalBill={totalBill}
          getTotalAssigned={getTotalAssigned}
          getItemAssignedQty={getItemAssignedQty}
          calculatePersonTotal={calculatePersonTotal}
          onOpenQuickAssign={handleOpenQuickAssign}
          onRemoveItemFromPerson={handleRemoveItemFromPerson}
          onBack={() => setActiveTab(0)}
          onContinue={() => setActiveTab(2)}
          canProceed={canProceedToStep3}
        />
      )}

      {activeTab === 2 && (
        <ConfirmationStep
          people={people}
          totalBill={totalBill}
          currency={bill.currency}
          bill={bill}
          sessionId={sessionId}
          calculatePersonTotal={calculatePersonTotal}
          onBack={() => setActiveTab(1)}
          onProceed={() => {
            // Redirigir a una página de confirmación o inicio
            window.location.href = "/payment/split";
          }}
        />
      )}

      {/* Dialog: Añadir persona */}
      <Dialog
        open={openAddPerson}
        onClose={() => {
          setOpenAddPerson(false);
          setNewPersonName("");
          setNewPersonEmail("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Añadir persona</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre completo"
            fullWidth
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Correo electrónico"
            type="email"
            fullWidth
            value={newPersonEmail}
            onChange={(e) => setNewPersonEmail(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddPerson();
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            onClick={() => {
              setOpenAddPerson(false);
              setNewPersonName("");
              setNewPersonEmail("");
            }}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAddPerson}
            variant="contained"
            disabled={!canAddPerson}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Añadir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Asignación Rápida */}
      <QuickAssignDialog
        open={openQuickAssign}
        bill={bill}
        people={people}
        quickAssignItemId={quickAssignItemId}
        quickAssignQuantities={quickAssignQuantities}
        getItemAssignedQty={getItemAssignedQty}
        onClose={() => setOpenQuickAssign(false)}
        onQuantityChange={handleQuickAssignQuantityChange}
        onAssign={handleQuickAssign}
      />
      </Box>
    </Box>
  );
};
