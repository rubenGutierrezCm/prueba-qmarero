/**
 * Email template generator for payment links
 * Generates HTML email with payment details and link
 */

import { Bill } from "@/types/bill";

interface EmailTemplateParams {
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

// Translation dictionaries
const translations: Record<string, Record<string, string>> = {
  es: {
    title: "Solicitud de Pago",
    hello: "Hola",
    billMessage: "Una cuenta del restaurante <strong>{tableName}</strong> (Mesa {tableId}) ha sido dividida y tienes un pago pendiente.",
    yourProducts: "Tus productos:",
    product: "Producto",
    quantity: "Cant.",
    price: "Precio",
    subtotal: "Subtotal",
    totalToPay: "Total a pagar:",
    payNow: "💳 Pagar Ahora",
    note: "<strong>Nota:</strong> Este enlace es único y personal. Haz clic en el botón para completar tu pago de forma segura.",
    servedBy: "Atendido por:",
    footer: "© 2025 Qmarero - Sistema de división de cuentas"
  },
  en: {
    title: "Payment Request",
    hello: "Hello",
    billMessage: "A bill from <strong>{tableName}</strong> restaurant (Table {tableId}) has been split and you have a pending payment.",
    yourProducts: "Your products:",
    product: "Product",
    quantity: "Qty.",
    price: "Price",
    subtotal: "Subtotal",
    totalToPay: "Total to pay:",
    payNow: "💳 Pay Now",
    note: "<strong>Note:</strong> This link is unique and personal. Click the button to complete your payment securely.",
    servedBy: "Served by:",
    footer: "© 2025 Qmarero - Bill splitting system"
  },
  fr: {
    title: "Demande de Paiement",
    hello: "Bonjour",
    billMessage: "Une addition du restaurant <strong>{tableName}</strong> (Table {tableId}) a été divisée et vous avez un paiement en attente.",
    yourProducts: "Vos produits:",
    product: "Produit",
    quantity: "Qté",
    price: "Prix",
    subtotal: "Sous-total",
    totalToPay: "Total à payer:",
    payNow: "💳 Payer Maintenant",
    note: "<strong>Note:</strong> Ce lien est unique et personnel. Cliquez sur le bouton pour effectuer votre paiement en toute sécurité.",
    servedBy: "Servi par:",
    footer: "© 2025 Qmarero - Système de division d'addition"
  }
};

export const generatePaymentEmail = (params: EmailTemplateParams): string => {
  const {
    personName,
    tableName,
    tableId,
    server,
    products,
    total,
    currency,
    paymentLink,
    language = 'es',
  } = params;

  const t = translations[language] || translations.es;
  const billMessage = t.billMessage.replace('{tableName}', tableName).replace('{tableId}', tableId);

  const productsHtml = products
    .map(
      (product) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${product.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${product.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${product.unitPrice.toFixed(2)} ${currency}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${product.subtotal.toFixed(2)} ${currency}</td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${t.title} - Qmarero</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Qmarero</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">${t.title}</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #667eea; margin-top: 0;">${t.hello} ${personName},</h2>
          
          <p style="font-size: 16px;">${billMessage}</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #667eea;">${t.yourProducts}</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #667eea;">${t.product}</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #667eea;">${t.quantity}</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #667eea;">${t.price}</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #667eea;">${t.subtotal}</th>
                </tr>
              </thead>
              <tbody>
                ${productsHtml}
              </tbody>
            </table>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #667eea; text-align: right;">
              <p style="margin: 0; font-size: 20px;">
                <strong>${t.totalToPay}</strong> 
                <span style="color: #667eea; font-size: 24px;">${total.toFixed(2)} ${currency}</span>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${paymentLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
              ${t.payNow}
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            ${t.note}
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
            <p>${t.servedBy} ${server}</p>
            <p>${t.footer}</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
