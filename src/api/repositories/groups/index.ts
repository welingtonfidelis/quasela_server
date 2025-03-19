import isEmpty from "lodash/isEmpty";
import { prisma } from "../../../config/db";
import {
  CreateGroupData,
  FindGroupByIdData,
  UpdateGroupData,
  FindGroupByUserIdData,
  DeleteGroupByIdData,
  FindGroupByUUIdData,
} from "./types";

const groupRepository = {
  create(data: CreateGroupData) {
    return prisma.group.create({
      data: {
        ...data,
        users: { create: [{ user: { connect: { id: data.owner_id } } }] },
      },
    });
  },

  async listByUserId(data: FindGroupByUserIdData) {
    const { user_id, filter_by_name, limit, page } = data;
    const offset = (page - 1) * limit;
    const where: any = { AND: [{ users: { some: { user_id } } }] };

    if (filter_by_name) {
      where.AND.push({
        name: { contains: filter_by_name, mode: "insensitive" },
      });
    }

    const total = await prisma.group.count({ where });

    const groups = await prisma.group.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: {
        created_at: "asc",
      },
    });

    return { groups, total };
  },

  findById(data: FindGroupByIdData) {
    const { id, include_events, include_users } = data;
    const where: any = { AND: [{ id }] };

    return prisma.group.findFirst({
      where,
      include: {
        events: include_events ? { select: { id: true, name: true, points: true, event_date: true } } : false,
        users: include_users
          ? { select: { user: { select: { id: true, name: true, image_url: true, image_key: true } } } }
          : false,
      },
    });
  },

  findByUUId(data: FindGroupByUUIdData) {
    const { uuid } = data;
    const where: any = { AND: [{ uuid }] };

    return prisma.group.findFirst({
      where,
    });
  },

  async updateById(data: UpdateGroupData) {
    const { id, include_user_ids, exclude_user_ids, ...rest } = data;
    const where: any = { AND: [{ id }] };

    return await prisma.$transaction(async (tx) => {
      if (!isEmpty(rest)) {
        await tx.group.update({
          where,
          data: rest,
        });
      }

      if (exclude_user_ids) {
        await tx.groupUser.deleteMany({
          where: {
            group_id: id,
            user_id: { in: exclude_user_ids },
          },
        });
      }

      if (include_user_ids) {
        await tx.groupUser.createMany({
          data: include_user_ids.map((userId) => ({ group_id: id, user_id: userId })),
        });
      }
    });
  },

  deleteById(data: DeleteGroupByIdData) {
    const { id } = data;
    const where: any = { AND: [{ id }] };

    return prisma.group.deleteMany({ where });
  },
};

export { groupRepository };
