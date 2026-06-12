import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const FROM = `"QuickFileTools" <${process.env.EMAIL_USER}>`;

function baseTemplate(content) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Inter, sans-serif; background: #f9fafb; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; }
        .header { background: #2563eb; padding: 28px 32px; }
        .header h1 { color: #fff; margin: 0; font-size: 20px; }
        .body { padding: 32px; color: #374151; line-height: 1.6; }
        .footer { padding: 16px 32px; background: #f3f4f6; font-size: 12px; color: #9ca3af; text-align: center; }
        .btn { display: inline-block; background: #2563eb; color: #fff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
        .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 20px; font-size: 13px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>⚡ QuickFileTools</h1></div>
        <div class="body">${content}</div>
        <div class="footer">© ${new Date().getFullYear()} QuickFileTools. All rights reserved.</div>
      </div>
    </body>
    </html>
  `;
}

export async function sendWelcomeEmail(to, name) {
  await transporter.sendMail({
    from: FROM, to,
    subject: "Welcome to QuickFileTools!",
    html: baseTemplate(`
      <h2>Hi ${name} 👋</h2>
      <p>Thanks for signing up! You get <strong>10 free conversions per day</strong>.</p>
      <a href="${process.env.FRONTEND_URL}/tools" class="btn">Start Converting →</a>
    `),
  });
}

export async function sendPasswordResetEmail(to, resetLink) {
  await transporter.sendMail({
    from: FROM, to,
    subject: "Reset your QuickFileTools password",
    html: baseTemplate(`
      <h2>Password Reset</h2>
      <p>Click the button below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetLink}" class="btn">Reset Password →</a>
      <p style="margin-top:16px;font-size:13px;color:#6b7280">If you didn't request this, ignore this email.</p>
    `),
  });
}

export async function sendPaymentSuccessEmail(to, planName, expiresAt) {
  await transporter.sendMail({
    from: FROM, to,
    subject: "Your Pro subscription is active 🎉",
    html: baseTemplate(`
      <h2>You're now Pro!</h2>
      <p><span class="badge">PRO</span></p>
      <p>Your <strong>${planName}</strong> subscription is active until <strong>${expiresAt.toLocaleDateString()}</strong>.</p>
      <p>You now have unlimited conversions, no ads, and priority processing.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Go to Dashboard →</a>
    `),
  });
}

export async function sendContactReply(to, name, message) {
  await transporter.sendMail({
    from: FROM, to,
    subject: "We received your message — QuickFileTools",
    html: baseTemplate(`
      <h2>Hi ${name},</h2>
      <p>Thanks for reaching out! We received your message:</p>
      <blockquote style="border-left:3px solid #e5e7eb;margin:16px 0;padding:8px 16px;color:#6b7280">${message}</blockquote>
      <p>We'll get back to you within 24 hours.</p>
    `),
  });
}
