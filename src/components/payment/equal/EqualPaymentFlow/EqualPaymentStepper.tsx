/**
 * EqualPaymentStepper - Stepper component for equal payment flow
 */
"use client";

import { Box, Stepper, Step, StepLabel, Typography } from "@mui/material";

interface Step {
  label: string;
}

interface EqualPaymentStepperProps {
  activeStep: number;
  steps: Step[];
}

export const EqualPaymentStepper = ({ activeStep, steps }: EqualPaymentStepperProps) => {
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
