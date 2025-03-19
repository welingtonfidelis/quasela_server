import { Router } from "express";
import multer from "multer";

import { userController } from "../../controllers/users";
import { payloadValidate } from "../../../shared/middleware/payloadValidate";
import {
  createSchema,
  loginSchema,
  updateProfileSchema,
  updateProfilePasswordSchema,
} from "./middleware/requestPayloadValidateSchema";

import { updateAssembler } from "./middleware/requestDataAssembler";

const userNoAuthRouter = Router();
const userRouter = Router();
const userNoRoleRouter = Router();
const { create, login, logout, getProfile, updateProfile, updateProfilePassword } = userController;

// NOT AUTHENTICATED ROUTES
userNoAuthRouter.post("/users", payloadValidate(createSchema), create);
userNoAuthRouter.post("/users/login", payloadValidate(loginSchema), login);
userNoAuthRouter.post("/users/logout", logout);

// userNoAuthRouter.post(
//   "/users/reset-password",
//   payloadValidate(resetPasswordSchema),
//   resetPassword
// );
// userNoAuthRouter.post(
//   "/users/update-reset-password",
//   payloadValidate(updatedResetedPasswordSchema),
//   updateResetedPassword
// );

// AUTHENTICATED ROUTES
userNoRoleRouter.get("/users/profile", getProfile);
userNoRoleRouter.patch(
  "/users/profile",
  [multer().single("file"), payloadValidate(updateProfileSchema), updateAssembler],
  updateProfile
);
userNoRoleRouter.patch("/users/profile/password", payloadValidate(updateProfilePasswordSchema), updateProfilePassword);

// ROUTES WITH PERMISSION VALIDATE
// userRouter.use(permissionValidate([ADMIN, MANAGER]));

// userRouter.get("/users", payloadValidate(listSchema), list);
// userRouter.get("/users/:id", payloadValidate(getByIdSchema), getById);
// userRouter.patch("/users/:id", [payloadValidate(updateSchema), updateAssembler], update);
// userRouter.post("/users", [payloadValidate(createSchema), createAssembler], create);
// userRouter.delete("/users/:id", payloadValidate(deleteSchema), deleteById);

export { userNoAuthRouter, userNoRoleRouter, userRouter };
