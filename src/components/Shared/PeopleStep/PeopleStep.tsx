/**
 * PeopleStep - First step of bill splitting wizard
 * Allows user to add and remove people who will share the bill
 */
"use client";

import {
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { PersonSplit } from "@/types/bill";
import { StepNavigation, PeopleListManager } from "@/components/ui";

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
  
  const handleBack = () => {
    const code = localStorage.getItem('currentTicketCode');
    router.push(code ? `/${code}` : '/');
  };
  
  return (
    <Box>
      <PeopleListManager
        people={people}
        onAddPerson={onAddPerson}
        onRemovePerson={onRemovePerson}
      />
      
      <StepNavigation
        onBack={handleBack}
        onContinue={onContinue}
        continueDisabled={people.length === 0}
      />
    </Box>
  );
};
