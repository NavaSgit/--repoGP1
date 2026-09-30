import { Router } from "express";
import {
  listar,
  obtenerPorId,
 estadisticas,
  ubicaciones,
} from "../controllers/persons.controller.js";

const router = Router();

// IMPORTANTE: /stats debe ir ANTES de /:id, si no Express
// interpreta "stats" como si fuera un BusinessEntityID.
router.get("/stats", estadisticas);
router.get("/", listar);
router.get("/:id/ubicaciones", ubicaciones);
router.get("/:id", obtenerPorId);

export default router;
