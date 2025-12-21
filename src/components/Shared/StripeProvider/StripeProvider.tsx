/**
 * StripeProvider - Wrapper for Stripe Elements provider
 * Initializes Stripe with client secret for payment processing
 */
"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripeProviderProps {
  /** Stripe client secret for payment intent */
  clientSecret: string;
  /** Child components that need Stripe context */
  children: React.ReactNode;
}

export const StripeProvider = ({
  clientSecret,
  children,
}: StripeProviderProps) => {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      {children}
    </Elements>
  );
}
