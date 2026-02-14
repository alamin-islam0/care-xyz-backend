import nodemailer from "nodemailer";
import { env } from "../config/env.js";

function getTransporter() {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });
}

export async function sendBookingInvoiceEmail({ to, customerName, booking, service }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("SMTP is not configured, skipping invoice email");
    return;
  }

  const html = `
    <h2>Care.xyz Booking Invoice</h2>
    <p>Hello ${customerName},</p>
    <p>Your booking has been created successfully.</p>
    <ul>
      <li><strong>Service:</strong> ${service.name}</li>
      <li><strong>Duration:</strong> ${booking.durationValue} ${booking.durationType}</li>
      <li><strong>Location:</strong> ${booking.location.division}, ${booking.location.district}, ${booking.location.city}, ${booking.location.area}</li>
      <li><strong>Address:</strong> ${booking.location.address}</li>
      <li><strong>Total Cost:</strong> $${booking.totalCost}</li>
      <li><strong>Status:</strong> ${booking.status}</li>
    </ul>
    <p>Thank you for choosing Care.xyz.</p>
  `;

  await transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject: "Your Care.xyz Booking Invoice",
    html
  });
}
