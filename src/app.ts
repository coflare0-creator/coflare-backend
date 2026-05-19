import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { alertRoutes } from "./alerts/alerts.route";

dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:8080", "https://coflare.org"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/alerts", alertRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Coflare backend server live" });
});

export default app;
