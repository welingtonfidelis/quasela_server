import { Router } from "express";
import { authCheckController } from "../../controllers/authCheck/controller";

const authCheckRouter = Router();
const { authCheck } = authCheckController;

authCheckRouter.get("/auth-check", authCheck);

export { authCheckRouter };
