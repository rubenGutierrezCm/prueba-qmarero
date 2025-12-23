/**
 * API route for sending payment emails via nodemailer
 * Uses Gmail SMTP service to send payment link emails to customers
 */
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { to, subject, html, paymentLink } = await request.json();

    // Configure transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "rubengutierrezcm@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "rztm rvge eooe tjbd",
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Qmarero - Bill Splitting" <${process.env.EMAIL_USER || "rubengutierrezcm@gmail.com"}>`,
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Error sending email" },
      { status: 500 }
    );
  }
}
