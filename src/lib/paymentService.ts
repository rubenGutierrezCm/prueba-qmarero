/**
 * Payment Service - Reusable utilities for payment processing
 * Handles session creation, payment processing, and email notifications
 */

import { saveSession, createPayment } from "@/lib/indexeddb";
import { generatePaymentEmail } from "@/lib/emailTemplate";
import { Bill, PersonSplit } from "@/types/bill";

/**
 * Product information for payment
 */
export interface PaymentProduct {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Parameters for creating a payment and sending email
 */
export interface CreatePaymentParams {
  sessionId: string;
  personId: string;
  personName: string;
  personEmail: string;
  amount: number;
  currency: string;
  products: PaymentProduct[];
}

/**
 * Parameters for email generation
 */
export interface EmailParams {
  personName: string;
  tableName: string;
  tableId: string;
  server: string;
  products: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  total: number;
  currency: string;
  paymentLink: string;
  language?: string;
}

/**
 * Creates a payment and sends email notification
 * This function performs three main steps:
 * 1. Creates payment record in IndexedDB
 * 2. Generates payment link URL
 * 3. Sends email with payment details and link
 * @param params - Payment creation parameters
 * @param emailParams - Email template parameters (without payment link)
 * @param language - Language for email template (es, en, fr)
 * @returns Promise resolving to the created payment ID
 * @throws Error if email sending fails
 */
export async function createPaymentAndSendEmail(
  params: CreatePaymentParams,
  emailParams: Omit<EmailParams, "paymentLink">,
  language = 'es'
): Promise<string> {
  // 1. Create payment in IndexedDB
  const paymentId = await createPayment({
    sessionId: params.sessionId,
    personId: params.personId,
    personName: params.personName,
    personEmail: params.personEmail,
    amount: params.amount,
    currency: params.currency,
    products: params.products,
  });

  // 2. Generate payment link
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const paymentLink = `${origin}/payment/link/${paymentId}`;

  // 3. Generate email HTML
  const emailHtml = generatePaymentEmail({
    ...emailParams,
    paymentLink,
    language,
  });

  // 4. Send email
  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: params.personEmail,
      subject: `💳 Pago pendiente - ${emailParams.tableName} (${params.amount.toFixed(2)} ${params.currency})`,
      html: emailHtml,
      paymentLink,
    }),
  });

  if (!response.ok) {
    throw new Error("Error sending email");
  }

  return paymentId;
}

/**
 * Processes a complete payment session for single person
 * Saves session, creates payment, and sends email
 * This is used when one person pays the entire bill
 * @param params - Parameters containing bill and person information
 * @returns Promise resolving to session ID and payment ID
 */
export async function processSinglePayment(params: {
  bill: Bill;
  personName: string;
  personEmail: string;
  totalAmount: number;
}): Promise<{ sessionId: string; paymentId: string }> {
  const { bill, personName, personEmail, totalAmount } = params;

  // Get current language from localStorage or default to 'es'
  const language = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') || 'es' : 'es';

  // Generate unique IDs
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  const personId = `P${Date.now()}`;

  // 1. Save session to IndexedDB
  await saveSession({
    sessionId,
    bill,
    people: [{
      id: personId,
      name: personName,
      email: personEmail,
      items: [],
      paid: false,
    }],
    createdAt: Date.now(),
  });

  // 2. Prepare products
  const products = bill.items.map(item => ({
    itemId: item.id,
    itemName: item.name,
    quantity: item.qty,
    unitPrice: item.unitPrice,
  }));

  // 3. Prepare email params
  const emailParams: Omit<EmailParams, "paymentLink"> = {
    personName,
    tableName: bill.table.name,
    tableId: bill.table.id,
    server: bill.table.server,
    products: bill.items.map(item => ({
      name: item.name,
      quantity: item.qty,
      unitPrice: item.unitPrice,
      subtotal: item.qty * item.unitPrice,
    })),
    total: totalAmount,
    currency: bill.currency,
  };

  // 4. Create payment and send email
  const paymentId = await createPaymentAndSendEmail(
    {
      sessionId,
      personId,
      personName,
      personEmail,
      amount: totalAmount,
      currency: bill.currency,
      products,
    },
    emailParams,
    language
  );

  return { sessionId, paymentId };
}

/**
 * Processes payments for multiple people
 * Saves session, creates payments for each person, and sends emails
 * This is used for split bills where different people pay different amounts
 * @param params - Parameters including session, bill, people, and calculation functions
 * @returns Promise resolving to array of created payment IDs
 */
export async function processMultiplePayments(params: {
  sessionId: string;
  bill: Bill;
  people: PersonSplit[];
  getPersonAmount: (person: PersonSplit) => number;
  getPersonProducts: (person: PersonSplit) => PaymentProduct[];
}): Promise<string[]> {
  const { sessionId, bill, people, getPersonAmount, getPersonProducts } = params;

  // Get current language from localStorage or default to 'es'
  const language = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') || 'es' : 'es';

  // 1. Save session to IndexedDB
  await saveSession({
    sessionId,
    bill,
    people: people.map(p => ({ ...p, paid: false })),
    createdAt: Date.now(),
  });

  // 2. Create payments and send emails for each person
  const paymentIds: string[] = [];
  
  for (const person of people) {
    const amount = getPersonAmount(person);
    const products = getPersonProducts(person);

    const emailParams: Omit<EmailParams, "paymentLink"> = {
      personName: person.name,
      tableName: bill.table.name,
      tableId: bill.table.id,
      server: bill.table.server,
      products: products.map(p => ({
        name: p.itemName,
        quantity: p.quantity,
        unitPrice: p.unitPrice,
        subtotal: p.quantity * p.unitPrice,
      })),
      total: amount,
      currency: bill.currency,
    };

    const paymentId = await createPaymentAndSendEmail(
      {
        sessionId,
        personId: person.id,
        personName: person.name,
        personEmail: person.email,
        amount,
        currency: bill.currency,
        products,
      },
      emailParams,
      language
    );

    paymentIds.push(paymentId);
  }

  return paymentIds;
}
