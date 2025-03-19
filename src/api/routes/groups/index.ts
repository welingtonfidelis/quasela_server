import { Router } from "express";

import { groupController } from "../../controllers/groups";
import { payloadValidate } from "../../../shared/middleware/payloadValidate";
import {
  createSchema,
  deleteSchema,
  getByIdSchema,
  listSchema,
  updateSchema,
  joinSchema,
} from "./middleware/requestPayloadValidateSchema";

const groupNoRoleRouter = Router();
const { create, delete: deleteById, getById, listByLoggedUser, joinGroupByUuid, update } = groupController;

// AUTHENTICATED ROUTES
groupNoRoleRouter.post("/groups", payloadValidate(createSchema), create);
groupNoRoleRouter.get("/groups", payloadValidate(listSchema), listByLoggedUser);
groupNoRoleRouter.get("/groups/:id", payloadValidate(getByIdSchema), getById);
groupNoRoleRouter.patch("/groups/:id", payloadValidate(updateSchema), update);
groupNoRoleRouter.patch("/groups/join/:uuid", payloadValidate(joinSchema), joinGroupByUuid);
groupNoRoleRouter.delete("/groups/:id", payloadValidate(deleteSchema), deleteById);

export { groupNoRoleRouter };
