import { Response, Request } from "express";
import { getDashboardStats } from "./dashboard.service";

export const dashboardStats = async (_req: Request, res: Response) => {
  const response = await getDashboardStats();

  res.status(200).json({ message: "Stats returned", data: response });
};
