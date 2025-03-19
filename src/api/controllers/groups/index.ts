import { Request, Response } from "express";

import { groupService } from "../../services/groups";
import { CreateGroupBody, UpdateGroupBody } from "./types";
import { HttpMessageEnum } from "../../../shared/enum/httpMessage";
import { parseToBoolean } from "../../../shared/utils";

const {
  createGroup,
  deleteGroupService,
  getGroupByIdService,
  getGroupByUUIdService,
  listGroupsByUserIdService,
  updateGroupService,
} = groupService;

const { NOT_UPDATED_NOT_FOUND, NOT_DELETE_NOT_FOUND } = HttpMessageEnum;

const groupController = {
  async create(req: Request, res: Response) {
    const body = req.body as CreateGroupBody;
    const { id } = req.authenticated_user;

    const newGroup = await createGroup({ ...body, owner_id: id });

    return res.json(newGroup);
  },

  async listByLoggedUser(req: Request, res: Response) {
    const { id } = req.authenticated_user;
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const filter_by_name = req.query.filter_by_name as string;

    const response = await listGroupsByUserIdService({
      user_id: id,
      page,
      limit,
      filter_by_name,
    });

    return res.json(response);
  },

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const includeEvents = parseToBoolean(req.query.include_events as string);
    const includeUsers = parseToBoolean(req.query.include_users as string);

    const selectedGroup = await getGroupByIdService({
      id,
      include_events: includeEvents,
      include_users: includeUsers,
    });

    if (!selectedGroup) return res.status(404).json({});

    return res.json(selectedGroup);
  },

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { id: loggedUserId } = req.authenticated_user;
    const body = req.body as UpdateGroupBody;

    const selectedGroup = await getGroupByIdService({
      id,
    });

    if (!selectedGroup) return res.status(NOT_UPDATED_NOT_FOUND.code).json({ message: NOT_UPDATED_NOT_FOUND.message });

    if (selectedGroup.owner_id !== loggedUserId) {
      return res.status(NOT_UPDATED_NOT_FOUND.code).json({ message: NOT_UPDATED_NOT_FOUND.message });
    }

    await updateGroupService({ ...body, id });

    return res.status(204).json({});
  },

  async joinGroupByUuid(req: Request, res: Response) {
    const uuid = req.params.uuid;
    console.log('uuid: ', uuid);
    const { id: loggedUserId } = req.authenticated_user;

    const selectedGroup = await getGroupByUUIdService({
      uuid,
    });

    if (!selectedGroup) return res.status(NOT_UPDATED_NOT_FOUND.code).json({ message: NOT_UPDATED_NOT_FOUND.message });

    const { id } = selectedGroup;

    await updateGroupService({ id, include_user_ids: [loggedUserId] });

    return res.status(204).json({});
  },

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { id: loggedUserId } = req.authenticated_user;

    const selectedGroup = await getGroupByIdService({
      id,
    });

    if (!selectedGroup) return res.status(NOT_DELETE_NOT_FOUND.code).json({ message: NOT_DELETE_NOT_FOUND.message });

    if (selectedGroup.owner_id !== loggedUserId) {
      return res.status(NOT_DELETE_NOT_FOUND.code).json({ message: NOT_DELETE_NOT_FOUND.message });
    }

    const { count } = await deleteGroupService({
      id,
    });

    if (!count) {
      return res.status(NOT_DELETE_NOT_FOUND.code).json({ message: NOT_DELETE_NOT_FOUND.message });
    }

    return res.status(204).json({});
  },
};

export { groupController };
