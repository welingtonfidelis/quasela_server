import { Router } from "express";
import { healthController } from "../../controllers/health/controller";

const healthRouter = Router();
const { healthCheck } = healthController;

healthRouter.get("/health-check", healthCheck);

export { healthRouter };
