import { Resend } from "resend";
import { supabase } from "../config/supabase";

interface AlertPayload {
  incident_type: string;
  severity: number;
  location_name: string;
  description: string;
}

/**
 * Environment-based configuration
 */
const ENV = process.env.NODE_ENV || "development";

const config = {
  development: {
    apiKey: process.env.RESEND_API_KEY,
    senderEmail: process.env.SENDER_EMAIL,
    senderName: process.env.SENDER_NAME || "CO-FLARE DEV",
  },
  production: {
    apiKey: process.env.RESEND_API_KEY_PROD,
    senderEmail: process.env.SENDER_EMAIL_PROD,
    senderName: process.env.SENDER_NAME_PROD || "CO-FLARE",
  },
}[ENV];

if (!config?.apiKey || !config.senderEmail) {
  throw new Error(`Missing email config for environment: ${ENV}`);
}

const resend = new Resend(config.apiKey);

export const sendEmail = async (alert: AlertPayload) => {
  try {
    // 1. Get users
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      throw new Error(error.message);
    }

    // 2. Extract emails
    const emails = data.users
      .map((user) => user.email)
      .filter((email): email is string => Boolean(email));

    if (!emails.length) {
      throw new Error("No emails found");
    }

    // 3. Send email
    const response = await resend.emails.send({
      from: `${config.senderName} <${config.senderEmail}>`,
      to: emails, // ✅ now actually using the list
      subject: "🚨 CO-FLARE ALERT",
      html: `
        <div style="font-family: sans-serif;">
          <h2>🚨 CO-FLARE ALERT</h2>

          <p><strong>Type:</strong> ${alert.incident_type}</p>
          <p><strong>Location:</strong> ${alert.location_name}</p>
          <p><strong>Severity:</strong> ${alert.severity}</p>

          <hr />

          <p>${alert.description}</p>
        </div>
      `,
    });

    console.log("EMAIL SENT:", response);

    return {
      success: true,
      data: response,
    };
  } catch (err: any) {
    console.error("EMAIL ERROR:", err.message);

    return {
      success: false,
      error: err.message,
    };
  }
};
