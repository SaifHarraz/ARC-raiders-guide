import nodemailer from 'nodemailer'

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD environment variable is not set')
    }
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  }
  return transporter
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تأكيد البريد الإلكتروني</title>
      <style>
        body { font-family: 'Cairo', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; direction: rtl; }
        .container { background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #1a1a1a; font-size: 24px; margin: 0; }
        .content { margin-bottom: 30px; }
        .content p { margin: 10px 0; }
        .button-container { text-align: center; margin: 30px 0; }
        .button { display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; font-size: 16px; }
        .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        .link { word-break: break-all; color: #3b82f6; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>مرحباً بك في Saif</h1></div>
        <div class="content">
          <p>شكراً لتسجيلك في دليل Arc Raiders!</p>
          <p>لإكمال عملية التسجيل، يرجى تأكيد بريدك الإلكتروني بالنقر على الزر أدناه:</p>
        </div>
        <div class="button-container">
          <a href="${verificationUrl}" class="button">تأكيد البريد الإلكتروني</a>
        </div>
        <div class="content">
          <p>أو يمكنك نسخ الرابط التالي ولصقه في متصفحك:</p>
          <p class="link">${verificationUrl}</p>
          <p><strong>ملاحظة:</strong> هذا الرابط صالح لمدة 24 ساعة فقط.</p>
        </div>
        <div class="footer">
          <p>إذا لم تقم بإنشاء حساب، يمكنك تجاهل هذا البريد الإلكتروني.</p>
          <p>&copy; 2025 Saif - دليل Arc Raiders</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
مرحباً بك في Saif

شكراً لتسجيلك في دليل Arc Raiders!

لإكمال عملية التسجيل، يرجى تأكيد بريدك الإلكتروني عبر الرابط التالي:
${verificationUrl}

ملاحظة: هذا الرابط صالح لمدة 24 ساعة فقط.

إذا لم تقم بإنشاء حساب، يمكنك تجاهل هذا البريد الإلكتروني.
  `;

  await getTransporter().sendMail({
    from: `"Arc Raiders Guide" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'تأكيد البريد الإلكتروني - Saif',
    text,
    html,
  });
}