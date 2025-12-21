/**
 * PeopleStep - First step of bill splitting wizard
 * Allows user to add and remove people who will share the bill
 */
"use client";

import {
  Box,
  Paper,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/navigation";
import { PersonSplit } from "@/types/bill";
import { PersonCard, EmptyState } from "@/components/ui";

interface PeopleStepProps {
  people: PersonSplit[];
  onAddPerson: () => void;
  onRemovePerson: (personId: string) => void;
  onContinue: () => void;
}

export const PeopleStep = ({
  people,
  onAddPerson,
  onRemovePerson,
  onContinue,
}: PeopleStepProps) => {
  const router = useRouter();
  
  return (
    <Box>
      <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Add person button */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          gap={2}
          mb={3}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddPerson}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Añadir persona
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {/* Empty state or people list */}
        {people.length === 0 ? (
          <EmptyState
            icon={<PersonIcon />}
            title="No hay personas añadidas"
            description="Añade las personas que van a compartir la cuenta"
          />
        ) : (
          <Box>
            {/* People grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                },
                gap: 2,
                mb: 3,
              }}
            >
              {people.map((person) => (
                <PersonCard
                  key={person.id}
                  name={person.name}
                  email={person.email}
                  onDelete={() => onRemovePerson(person.id)}
                />
              ))}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* People count */}
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              gap={2}
            >
              <Typography variant="body1">
                Total: {people.length} persona{people.length !== 1 ? "s" : ""}
              </Typography>
            </Box>
          </Box>
        )}       
      </Paper>
      
      {/* Navigation buttons */}
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          variant="outlined"
          onClick={() => router.push('/')}
        >
          volver
        </Button>
        <Button
          variant="contained"
          onClick={onContinue}
        >
          Continuar
        </Button>
      </Box>
    </Box>
  );
};
