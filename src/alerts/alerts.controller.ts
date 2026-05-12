import { sendEmail } from "./sendEmail";
import { sendSMS } from "./sendSms";
import { Request, Response } from "express";

export const sendAlert = async (req: Request, res: Response) => {
  const alert = req.body;

  try {
    const smsResult = await sendSMS(alert);
    const emailResult = await sendEmail(alert);

    return res.status(200).json({
      success: true,
      sms: smsResult,
      email: emailResult,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
