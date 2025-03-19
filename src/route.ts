import { NextFunction, Request, Response, Router } from "express";

import { userNoAuthRouter, userNoRoleRouter, userRouter } from "./api/routes/users";
import { authValidate } from "./shared/middleware/authValidate";
import { healthRouter } from "./api/routes/health";
import { httpMessageRouter } from "./api/routes/httpMessages";
import { authCheckRouter } from "./api/routes/authCheck";
import { groupNoRoleRouter } from "./api/routes/groups";
import { eventNoRoleRouter } from "./api/routes/events";

const router = Router();

// ERROR HANDLER
router.use((error: any, _req: Request, res: Response, next: NextFunction) => {
  console.log('error: ', error);
  const statusCode = error?.code || 500;
  const errorMessage = error?.message || "Internal server error";

  res.status(statusCode).json({ message: errorMessage });
});

// NO AUTHENTICATED ROUTES
router.use(healthRouter);
router.use(userNoAuthRouter);

// AUTHENTICATED ROUTES
router.use(authValidate);

// no role requested
router.use(authCheckRouter);
router.use(httpMessageRouter);
router.use(userNoRoleRouter);
router.use(groupNoRoleRouter);
router.use(eventNoRoleRouter);

// ADMIN/MANAGER role requested below
router.use(userRouter);

export { router };
