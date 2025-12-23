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
import { PersonCard, EmptyState, StepNavigation } from "@/components/ui";
import { useTranslation } from 'react-i18next';

/**
 * Props for the PeopleStep component
 */
interface PeopleStepProps {  
  /** List of people sharing the bill */
  people: PersonSplit[];
  /** Callback when add person button is clicked */
  onAddPerson: () => void;
  /** Callback when removing a person */
  onRemovePerson: (personId: string) => void;
  /** Callback when continuing to next step */
  onContinue: () => void;
}

export const PeopleStep = ({
  people,
  onAddPerson,
  onRemovePerson,
  onContinue,
}: PeopleStepProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  
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
            {t('people.addPerson')}
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {/* Empty state or people list */}
        {people.length === 0 ? (
          <EmptyState
            icon={<PersonIcon />}
            title={t('people.noPeopleAdded')}
            description={t('people.addPeopleDescription')}
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
                {t('people.totalPeople', { count: people.length })}
              </Typography>
            </Box>
          </Box>
        )}       
      </Paper>
      
      <StepNavigation
        onBack={() => router.push('/')}
        onContinue={onContinue}
        continueDisabled={people.length === 0}
      />
    </Box>
  );
};
