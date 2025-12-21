/**
 * BillSplitterStepper - Stepper component for bill splitting wizard
 * Displays current step and progress through the flow
 */
"use client";

import { Box, Stepper, Step, StepLabel, Typography } from "@mui/material";

interface Step {
  label: string;
}

interface BillSplitterStepperProps {
  activeStep: number;
  steps: Step[];
}

export const BillSplitterStepper = ({ activeStep, steps }: BillSplitterStepperProps) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.label} completed={activeStep > index}>
            <StepLabel />
          </Step>
        ))}
      </Stepper>
      
      {/* Current step description */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          {steps[activeStep].label}
        </Typography>
      </Box>
    </Box>
  );
};
