import { Router } from "express";

import { eventController } from "../../controllers/events";
import { payloadValidate } from "../../../shared/middleware/payloadValidate";
import {
  createSchema,
  deleteSchema,
  getByIdSchema,
  listSchema,
  updateSchema,
} from "./middleware/requestPayloadValidateSchema";

const eventNoRoleRouter = Router();
const { create, delete: deleteById, getById, listByLoggedUser, update } = eventController;

// AUTHENTICATED ROUTES
eventNoRoleRouter.post("/events", payloadValidate(createSchema), create);
// eventNoRoleRouter.get("/events", payloadValidate(listSchema), listByLoggedUser);
eventNoRoleRouter.get("/events/:id", payloadValidate(getByIdSchema), getById);
eventNoRoleRouter.patch("/events/:id", payloadValidate(updateSchema), update);
eventNoRoleRouter.delete("/events/:id", payloadValidate(deleteSchema), deleteById);

export { eventNoRoleRouter };
