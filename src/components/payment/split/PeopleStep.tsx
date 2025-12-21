"use client";

import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import { PersonSplit } from "@/types/bill";
import { useRouter } from "next/navigation";

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

        {people.length === 0 ? (
          <Box textAlign="center" py={{ xs: 4, sm: 6 }}>
            <PersonIcon
              sx={{ fontSize: { xs: 48, sm: 64 }, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay personas añadidas
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Añade las personas que van a compartir la cuenta
            </Typography>
          </Box>
        ) : (
          <Box>
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
                <Card key={person.id} variant="outlined">
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box flex={1}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <PersonIcon color="primary" />
                          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                            {person.name}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                            {person.email}
                          </Typography>
                        </Box>
                      </Box>
                        <IconButton
                        size="small"
                        onClick={() => onRemovePerson(person.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Divider sx={{ my: 3 }} />

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
              {/* 
              
              */}
            </Box>
          </Box>
        )}       
      </Paper>
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
          disabled={people.length === 0}
        >
          Continuar
        </Button>
      </Box>
    </Box>
  );
};
