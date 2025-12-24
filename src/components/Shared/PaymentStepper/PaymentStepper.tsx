/**
 * PaymentStepper - Reusable stepper component for payment flows
 * Displays current step and progress through the flow
 */
"use client";

import { Box, Stepper, Step, StepLabel, Typography } from "@mui/material";

interface Step {
  label: string;
}

interface PaymentStepperProps {
  activeStep: number;
  steps: Step[];
}

export const PaymentStepper = ({ activeStep, steps }: PaymentStepperProps) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.label} completed={activeStep > index}>
            <StepLabel />
          </Step>
        ))}
      </Stepper>
      
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          {steps[activeStep].label}
        </Typography>
      </Box>
    </Box>
  );
};
