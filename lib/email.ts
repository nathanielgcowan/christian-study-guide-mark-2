export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const emailProvider = process.env.EMAIL_PROVIDER || "mock";

  if (emailProvider === "resend") {
    return sendViaResend(payload);
  }

  if (emailProvider === "sendgrid") {
    return sendViaSendGrid(payload);
  }

  console.log("[MOCK EMAIL]", payload);
  return true;
}

async function sendViaResend(payload: EmailPayload): Promise<boolean> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "noreply@example.com",
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Resend error:", error);
    return false;
  }
}

async function sendViaSendGrid(payload: EmailPayload): Promise<boolean> {
  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: payload.to }] }],
        from: { email: process.env.EMAIL_FROM || "noreply@example.com" },
        subject: payload.subject,
        content: [
          { type: "text/html", value: payload.html },
          { type: "text/plain", value: payload.text },
        ],
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("SendGrid error:", error);
    return false;
  }
}

export async function sendDailyDevotional(
  email: string,
  verse: string,
  reflection: string,
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: "Daily Devotional - Your verse for today",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Today's Verse</h2>
        <blockquote style="border-left: 4px solid #3b82f6; padding-left: 16px; margin: 20px 0;">
          <p style="font-size: 18px; font-weight: bold; color: #1f2937;">${verse}</p>
        </blockquote>
        <h3>Reflection</h3>
        <p style="line-height: 1.6; color: #4b5563;">${reflection}</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #9ca3af;">
          <a href="https://example.com/settings">Manage email preferences</a>
        </p>
      </div>
    `,
    text: `Today's Verse:\n\n${verse}\n\nReflection:\n\n${reflection}`,
  });
}
