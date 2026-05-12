import { Router } from "express";
import { sendAlert } from "./alerts.controller";

export const alertRoutes = Router();

alertRoutes.post("/send", sendAlert);
