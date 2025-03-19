import { isEmpty } from "lodash";
import { prisma } from "../../../config/db";
import {
  CreateEventData,
  FindEventByIdData,
  UpdateEventData,
  FindEventByUserIdData,
  DeleteEventByIdData,
} from "./types";

const eventRepository = {
  async create(data: CreateEventData) {
    const { user_ids = [], group_id, ...rest } = data;

    return prisma.event.create({
      data: {
        ...rest,
        group: { connect: { id: group_id } },
        users: { create: user_ids.map((userId) => ({ user: { connect: { id: userId } } })) },
      },
    });
  },

  async listByUserId(data: FindEventByUserIdData) {
    const { user_id, filter_by_name, limit, page } = data;
    const offset = (page - 1) * limit;
    const where: any = { AND: [{ users: { some: { user_id } } }] };

    if (filter_by_name) {
      where.AND.push({
        name: { contains: filter_by_name, mode: "insensitive" },
      });
    }

    const total = await prisma.event.count({ where });

    const events = await prisma.event.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: {
        created_at: "asc",
      },
    });

    return { events, total };
  },

  findById(data: FindEventByIdData) {
    const { id, include_users } = data;
    const where: any = { AND: [{ id }] };

    return prisma.event.findFirst({
      where,
      include: {
        users: include_users
          ? { select: { user: { select: { id: true, name: true, image_url: true, image_key: true } } } }
          : false,
      },
    });
  },

  async updateById(data: UpdateEventData) {
    const { id, exclude_user_ids, include_user_ids, ...rest } = data;
    const where: any = { AND: [{ id }] };

    return await prisma.$transaction(async (tx) => {
      if (!isEmpty(rest)) {
        await tx.event.update({
          where,
          data: rest,
        });
      }

      if (exclude_user_ids) {
        await tx.userEvent.deleteMany({
          where: {
            event_id: id,
            user_id: { in: exclude_user_ids },
          },
        });
      }

      if (include_user_ids) {
        await tx.userEvent.createMany({
          data: include_user_ids.map((userId) => ({ event_id: id, user_id: userId })),
        });
      }
    });
  },

  deleteById(data: DeleteEventByIdData) {
    const { id } = data;
    const where: any = { AND: [{ id }] };

    return prisma.event.deleteMany({ where });
  },
};

export { eventRepository };
