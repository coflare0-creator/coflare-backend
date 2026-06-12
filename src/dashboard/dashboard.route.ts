import { Router } from "express";
import { dashboardStats } from "./dashboard.controller";

export const dashboardRoutes = Router();

dashboardRoutes.get("/", dashboardStats);
