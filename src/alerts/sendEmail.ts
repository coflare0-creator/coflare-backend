import { Resend } from "resend";
import { supabase } from "../config/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

interface AlertPayload {
  incident_type: string;
  severity: number;
  location_name: string;
  description: string;
}

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

    // 3. Send bulk email
    const response = await resend.emails.send({
      from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
      to: "josiahelias11@gmail.com", //emails,
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
