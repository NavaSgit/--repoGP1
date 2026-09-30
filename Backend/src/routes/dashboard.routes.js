import { Router } from "express";
import { resumenDashboard } from "../controllers/persons.controller.js";

const router = Router();

router.get("/summary", resumenDashboard);

export default router;
