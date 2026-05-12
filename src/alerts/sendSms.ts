import axios from "axios";
import { supabase } from "../config/supabase";

interface AlertPayload {
  incident_type: string;
  severity: number;
  location_name: string;
  description: string;
}

export const sendSMS = async (alert: AlertPayload) => {
  try {
    // 1. Get all users
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      throw new Error(error.message);
    }

    // 2. Extract phone numbers
    const phones =
      data.users
        .map((user) => user.user_metadata?.phone)
        .filter(Boolean)
        .map((phone) => {
          const cleaned = phone.replace(/\D/g, "");

          if (cleaned.startsWith("0")) {
            return `+234${cleaned.slice(1)}`;
          }

          if (cleaned.startsWith("234")) {
            return cleaned;
          }

          return cleaned;
        }) || [];

    if (!phones.length) {
      throw new Error("No phone numbers found");
    }

    const message = `CO-FLARE ALERT

    Type: ${alert.incident_type}
    Location: ${alert.location_name}
    Severity: ${alert.severity}

    ${alert.description}`;

    // 4. Send bulk SMS via Termii

    const response = await axios.post(
      "https://v3.api.termii.com/api/sms/send",
      {
        api_key: process.env.TERMII_API_KEY,
        to: phones,
        from: "MoneySmith",
        sms: message,
        type: "plain",
        channel: "generic",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("SMS SENT:", response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (err: any) {
    console.log(err);
    console.error("SMS ERROR:", err.message);

    return {
      success: false,
      error: err.message,
    };
  }
};
