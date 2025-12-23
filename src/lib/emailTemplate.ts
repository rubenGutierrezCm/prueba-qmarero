/**
 * Email template generator for payment links
 * Generates HTML email with payment details and link
 */

import { Bill, PersonSplit } from "@/types/bill";

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
}

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
  } = params;

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
        <title>Payment Request - Qmarero</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Qmarero</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Bill Splitting</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #667eea; margin-top: 0;">Hello ${personName},</h2>
          
          <p style="font-size: 16px;">A bill from <strong>${tableName}</strong> restaurant (Table ${tableId}) has been split and you have a pending payment.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #667eea;">Your products:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #667eea;">Product</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #667eea;">Qty.</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #667eea;">Price</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #667eea;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${productsHtml}
              </tbody>
            </table>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #667eea; text-align: right;">
              <p style="margin: 0; font-size: 20px;">
                <strong>Total to pay:</strong> 
                <span style="color: #667eea; font-size: 24px;">${total.toFixed(2)} ${currency}</span>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${paymentLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
              💳 Pay Now
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            <strong>Note:</strong> This link is unique and personal. Click the button to complete your payment securely.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
            <p>Served by: ${server}</p>
            <p>© 2025 Qmarero - Bill splitting system</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Helper to create email params from person and bill data
 * @param person - Person splitting the bill
 * @param bill - The bill data
 * @param personTotal - Total amount for this person
 * @param paymentLink - Payment link URL
 * @returns Email template parameters
 */
export const createEmailParams = (
  person: PersonSplit,
  bill: Bill,
  personTotal: number,
  paymentLink: string
): EmailTemplateParams => {
  const products = person.items.map((item) => {
    const billItem = bill.items.find((bi) => bi.id === item.itemId);
    return {
      name: billItem?.name || "Unknown product",
      quantity: item.quantity,
      unitPrice: billItem?.unitPrice || 0,
      subtotal: (billItem?.unitPrice || 0) * item.quantity,
    };
  });

  return {
    personName: person.name,
    tableName: bill.table.name,
    tableId: bill.table.id,
    server: bill.table.server,
    products,
    total: personTotal,
    currency: bill.currency,
    paymentLink,
  };
};
