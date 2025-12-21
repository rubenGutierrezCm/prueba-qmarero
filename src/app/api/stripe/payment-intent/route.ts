/**
 * API route for creating Stripe payment intents
 * Creates a new payment intent with automatic payment methods enabled
 */
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const amount = 4850; // céntimos

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
  });
}
