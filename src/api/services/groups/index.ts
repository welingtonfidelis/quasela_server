import {
  CreateGroupPayload,
  DeleteGroupByIdPayload,
  FindGroupByIdPayload,
  FindGroupByUserIdPayload,
  FindGroupByUUIdPayload,
  UpdateGroupPayload,
} from "./types";
import { groupRepository } from "../../repositories/groups";

const { create, findById, updateById, listByUserId, findByUUId, deleteById } = groupRepository;

const groupService = {
  async createGroup(payload: CreateGroupPayload) {
    return create(payload);
  },

  getGroupByIdService(payload: FindGroupByIdPayload) {
    return findById(payload);
  },

  getGroupByUUIdService(payload: FindGroupByUUIdPayload) {
    return findByUUId(payload);
  },

  listGroupsByUserIdService(payload: FindGroupByUserIdPayload) {
    return listByUserId(payload);
  },

  updateGroupService(payload: UpdateGroupPayload) {
    return updateById(payload);
  },

  deleteGroupService(payload: DeleteGroupByIdPayload) {
    return deleteById(payload);
  },
};

export { groupService };
