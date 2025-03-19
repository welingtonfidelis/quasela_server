import {
  CreateEventPayload,
  DeleteEventByIdPayload,
  FindEventByIdPayload,
  FindEventByUserIdPayload,
  UpdateEventPayload,
} from "./types";
import { eventRepository } from "../../repositories/events";

const { create, findById, updateById, listByUserId, deleteById } = eventRepository;

const eventService = {
  async createEvent(payload: CreateEventPayload) {
    return create(payload);
  },

  getEventByIdService(payload: FindEventByIdPayload) {
    return findById(payload);
  },

  listEventsByUserIdService(payload: FindEventByUserIdPayload) {
    return listByUserId(payload);
  },

  async updateEventService(payload: UpdateEventPayload) {
    return updateById(payload);
  },

  deleteEventService(payload: DeleteEventByIdPayload) {
    return deleteById(payload);
  },
};

export { eventService };
