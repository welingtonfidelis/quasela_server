import { Request, Response } from "express";

import { eventService } from "../../services/events";
import { CreateEventBody, UpdateEventBody } from "./types";
import { HttpMessageEnum } from "../../../shared/enum/httpMessage";
import { parseToBoolean } from "../../../shared/utils";
import { groupService } from "../../services/groups";

const { createEvent, deleteEventService, getEventByIdService, listEventsByUserIdService, updateEventService } =
  eventService;

const { getGroupByIdService } = groupService;

const { NOT_UPDATED_NOT_FOUND, NOT_DELETE_NOT_FOUND } = HttpMessageEnum;

const eventController = {
  async create(req: Request, res: Response) {
    const body = req.body as CreateEventBody;

    const newEvent = await createEvent(body);

    return res.json(newEvent);
  },

  async listByLoggedUser(req: Request, res: Response) {
    const { id } = req.authenticated_user;
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const filter_by_name = req.query.filter_by_name as string;

    const response = await listEventsByUserIdService({
      user_id: id,
      page,
      limit,
      filter_by_name,
    });

    return res.json(response);
  },

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const includeUsers = parseToBoolean(req.query.include_users as string);

    const selectedEvent = await getEventByIdService({
      id,
      include_users: includeUsers,
    });

    if (!selectedEvent) return res.status(404).json({});

    return res.json(selectedEvent);
  },

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { id: loggedUserId } = req.authenticated_user;
    const body = req.body as UpdateEventBody;

    const selectedEvent = await getEventByIdService({
      id,
    });

    if (!selectedEvent) return res.status(NOT_UPDATED_NOT_FOUND.code).json({ message: NOT_UPDATED_NOT_FOUND.message });

    const selectedGroup = await getGroupByIdService({ id: selectedEvent.group_id });

    if (selectedGroup?.owner_id !== loggedUserId) {
      return res.status(NOT_UPDATED_NOT_FOUND.code).json({ message: NOT_UPDATED_NOT_FOUND.message });
    }

    await updateEventService({ ...body, id });

    return res.status(204).json({});
  },

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { id: loggedUserId } = req.authenticated_user;

    const selectedEvent = await getEventByIdService({
      id,
    });

    if (!selectedEvent) return res.status(NOT_DELETE_NOT_FOUND.code).json({ message: NOT_DELETE_NOT_FOUND.message });

    const selectedGroup = await getGroupByIdService({ id: selectedEvent.group_id });

    if (selectedGroup?.owner_id !== loggedUserId) {
      return res.status(NOT_DELETE_NOT_FOUND.code).json({ message: NOT_DELETE_NOT_FOUND.message });
    }

    const { count } = await deleteEventService({
      id,
    });

    if (!count) {
      return res.status(NOT_DELETE_NOT_FOUND.code).json({ message: NOT_DELETE_NOT_FOUND.message });
    }

    return res.status(204).json({});
  },
};

export { eventController };
