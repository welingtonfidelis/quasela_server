import { config } from "../../../config";
import { prisma } from "../../../config/db";
import { CreateUserData, FindUserByEmailData, FindUserByIdData, FindUserByUserLoginData, FindUserByUsernameOrEmailData, UpdateUserData } from "./types";

const userRepository = {
  create(data: CreateUserData) {
    return prisma.user.create({ data });
  },

  findByUserLoginOrEmail(data: FindUserByUsernameOrEmailData) {
    const { user_login, email } = data;
    const where: any = { AND: [{ OR: [{ user_login }, { email }] }] };

    return prisma.user.findFirst({ where });
  },

  findByUserName(data: FindUserByUserLoginData) {
    const { user_login } = data;
    const where: any = { AND: [{ user_login }] };

    return prisma.user.findFirst({ where });
  },

  findByEmail(data: FindUserByEmailData) {
    const { email } = data;
    const where: any = { AND: [{ email }] };

    return prisma.user.findFirst({ where });
  },

  findById(data: FindUserByIdData) {
    const { id } = data;
    const where: any = { AND: [{ id }] };

    return prisma.user.findFirst({ where });
  },

  updateById(data: UpdateUserData) {
    const { id, ...rest } = data;
    const where: any = { AND: [{ id }] };

    return prisma.user.updateMany({
      where,
      data: rest,
    });
  },

  // create(data: CreateUserData) {
  //   return prisma.user.create({ data });
  // },

  // async listAll(data: ListAllData) {
  //   const {
  //     logged_user_id,
  //     page,
  //     limit,
  //     filter_by_id,
  //     filter_by_name,
  //     filter_by_company_id,
  //     filter_by_company_name,
  //     include_company
  //   } = data;
  //   const offset = (page - 1) * limit;

  //   const where: any = { AND: [] };
  //   const include = { company: false };

  //   // filters
  //   if (filter_by_id && filter_by_id !== logged_user_id) {
  //     where.AND.push({ id: filter_by_id });
  //   } else where.AND.push({ id: { not: logged_user_id } });

  //   if (filter_by_name) {
  //     where.AND.push({
  //       name: { contains: filter_by_name, mode: "insensitive" },
  //     });
  //   }

  //   if (filter_by_company_id) {
  //     where.AND.push({ company_id: filter_by_company_id });
  //   }

  //   if (filter_by_company_name) {
  //     where.AND.push({
  //       company: {
  //         name: { contains: filter_by_company_name, mode: "insensitive" },
  //       },
  //     });
  //   }

  //   // relations includes
  //   if (include_company) {
  //     include.company = true;
  //   }

  //   const total = await prisma.user.count({ where });

  //   const users = await prisma.user.findMany({
  //     where,
  //     skip: offset,
  //     take: limit,
  //     orderBy: {
  //       name: "asc",
  //     },
  //     include,
  //   });

  //   return { users, total };
  // },

  // deleteById(data: DeleteUserByIdData) {
  //   const { id, filter_by_company_id } = data;
  //   const where: any = { AND: [{ id }] };

  //   if (filter_by_company_id) {
  //     where.AND.push({ company_id: filter_by_company_id });
  //   }

  //   return prisma.user.deleteMany({ where });
  // },
};

export { userRepository };
