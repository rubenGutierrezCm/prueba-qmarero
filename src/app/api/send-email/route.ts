import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { to, subject, html, paymentLink } = await request.json();

    // Configurar transporter con Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "rubengutierrezcm@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "rztm rvge eooe tjbd",
      },
    });

    // Enviar correo
    await transporter.sendMail({
      from: `"Qmarero - División de Cuenta" <${process.env.EMAIL_USER || "rubengutierrezcm@gmail.com"}>`,
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Error al enviar el correo" },
      { status: 500 }
    );
  }
}
