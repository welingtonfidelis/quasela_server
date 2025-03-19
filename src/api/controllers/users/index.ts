import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { userService } from "../../services/users";
import { createUserSessionToken, validateToken } from "../../../shared/service/token";
import { config } from "../../../config";
import {
  CreateUserBody,
  LoginBody,
  ResetPasswordBody,
  UpdatePasswordBody,
  UpdateResetedPasswordBody,
  UpdateUserBody,
} from "./types";
import { AppError } from "../../../errors/AppError";
import { HttpMessageEnum } from "../../../shared/enum/httpMessage";
import { UpdateUserPayload } from "../../services/users/types";
import { getTemporaryFileUrl } from "../../../shared/service/fileS3";

const {
  createUser,
  getUserByUserLoginOrEmailService,
  getUserByIdService,
  updateUserService,
  getUserByEmailService,
  getUserByUsernameService,
} = userService;

const { JSON_SECRET, COOKIE_DOMAIN } = config;
const {
  INVALID_USERNAME_OR_EMAIL,
  INVALID_PASSWORD,
  INVALID_OLD_PASSWORD,
  INVALID_PERMISSION,
  INVALID_RESET_TOKEN,
  BLOCKED_USER,
  CAN_NOT_DELETE_YOURSELF,
  EMAIL_ALREADY_USED,
  USERNAME_ALREADY_USED,
  USER_NOT_FOUND,
  NOT_UPDATED_NOT_FOUND,
  NOT_DELETE_NOT_FOUND,
} = HttpMessageEnum;

const userController = {
  async create(req: Request, res: Response) {
    const body = req.body as CreateUserBody;

    const selectedUser = await getUserByUserLoginOrEmailService({
      user_login: body.user_login,
      email: body.email,
    });

    if (selectedUser) {
      if (selectedUser.user_login === body.user_login) {
        return res.status(USERNAME_ALREADY_USED.code).json({ message: USERNAME_ALREADY_USED.message });
      }

      if (selectedUser.email === body.email) {
        return res.status(EMAIL_ALREADY_USED.code).json({ message: EMAIL_ALREADY_USED.message });
      }
    }

    const newUser = await createUser({ ...body });

    const { user_password, created_at, updated_at, ...rest } = newUser;
    return res.json(rest);
  },

  async login(req: Request, res: Response) {
    const body = req.body as LoginBody;
    const { user_login, user_password } = body;

    const selectedUser = await getUserByUserLoginOrEmailService({
      user_login,
      email: user_login,
    });

    if (!selectedUser) {
      return res.status(INVALID_USERNAME_OR_EMAIL.code).json({ message: INVALID_USERNAME_OR_EMAIL.message });
    }

    if (selectedUser.is_blocked) {
      return res.status(BLOCKED_USER.code).json({ message: BLOCKED_USER.message });
    }

    const validPassword = bcrypt.compareSync(user_password, selectedUser.user_password);
    if (!validPassword) {
      return res.status(INVALID_PASSWORD.code).json({ message: INVALID_PASSWORD.message });
    }

    const { id, permissions } = selectedUser;
    const cookieData = createUserSessionToken({ id, permissions });

    res.cookie("secure_application_cookie", JSON.stringify({ token: cookieData }), {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: COOKIE_DOMAIN,
    });

    const user = {
      id: selectedUser.id,
      name: selectedUser.name,
      email: selectedUser.email,
      permissions: selectedUser.permissions,
    };

    return res.json(user);
  },

  logout(req: Request, res: Response) {
    res.clearCookie("secure_application_cookie");

    return res.status(204).json({});
  },

  async getProfile(req: Request, res: Response) {
    const { id } = req.authenticated_user;

    const selectedUser = await getUserByIdService({ id });

    if (!selectedUser) {
      return res.status(USER_NOT_FOUND.code).json({ message: USER_NOT_FOUND.message });
    }

    const { user_password, updated_at, image_url, image_key, ...rest } = selectedUser;

    // 9 hours = 32400
    const temporaryImageUrl = await getTemporaryFileUrl(image_key, 32400);

    return res.json({ ...rest, image_url: temporaryImageUrl, image_key });
  },

  async updateProfile(req: Request, res: Response) {
    const { id } = req.authenticated_user;
    const body = req.body as UpdateUserBody;
    const { user_login, email } = body;
    const { file } = req;

    if (user_login) {
      const selectedUser = await getUserByUsernameService({ user_login });

      if (selectedUser && selectedUser.id !== id) {
        return res.status(USERNAME_ALREADY_USED.code).json({ message: USERNAME_ALREADY_USED.message });
      }
    }

    if (email) {
      const selectedUser = await getUserByEmailService({ email });

      if (selectedUser && selectedUser.id !== id) {
        return res.status(EMAIL_ALREADY_USED.code).json({ message: EMAIL_ALREADY_USED.message });
      }
    }

    const payload = { ...body, file, id } as UpdateUserPayload;

    await updateUserService(payload);

    return res.status(204).json({});
  },

  async updateProfilePassword(req: Request, res: Response) {
    const { id } = req.authenticated_user;
    const body = req.body as UpdatePasswordBody;
    const { old_password, new_password } = body;

    const selectedUser = await getUserByIdService({ id });

    if (!selectedUser) {
      return res.status(USER_NOT_FOUND.code).json({ message: USER_NOT_FOUND.message });
    }

    const validPassword = bcrypt.compareSync(old_password, selectedUser.user_password);
    if (!validPassword) {
      return res.status(INVALID_OLD_PASSWORD.code).json({ message: INVALID_OLD_PASSWORD.message });
    }

    await updateUserService({ id, user_password: new_password });

    return res.status(204).json({});
  },

  // async resetPassword(req: Request, res: Response) {
  //   const body = req.body as ResetPasswordBody;
  //   const { user_login, language } = body;

  //   const selectedUser = await getUserByUsernameOrEmailService({
  //     user_login,
  //     email: user_login,
  //   });

  //   if (!selectedUser) {
  //     return res
  //       .status(INVALID_USERNAME_OR_EMAIL.code)
  //       .json({ message: INVALID_USERNAME_OR_EMAIL.message });
  //   }

  //   if (selectedUser.is_blocked) {
  //     return res
  //       .status(BLOCKED_USER.code)
  //       .json({ message: BLOCKED_USER.message });
  //   }

  //   const { id, company_id, name, email } = selectedUser;
  //   await resetUserPasswordService({ id, company_id, name, email, language });

  //   return res.status(204).json({});
  // },

  // async updateResetedPassword(req: Request, res: Response) {
  //   const { new_password, token } = req.body as UpdateResetedPasswordBody;

  //   try {
  //     const { id, company_id } = validateToken(token, JSON_SECRET) as any;
  //     await updateUserService({
  //       id,
  //       user_password: new_password,
  //       filter_by_company_id: company_id,
  //     });

  //     return res.status(204).json({});
  //   } catch (error) {
  //     return res
  //       .status(INVALID_RESET_TOKEN.code)
  //       .json({ message: INVALID_RESET_TOKEN.message });
  //   }
  // },

  // async list(req: Request, res: Response) {
  //   const { id, company_id, permissions } = req.authenticated_user;
  //   const page = parseInt(req.query.page as string);
  //   const limit = parseInt(req.query.limit as string);
  //   const filter_by_id = parseInt(req.query.filter_by_id as string);
  //   const filter_by_name = req.query.filter_by_name as string;

  //   const users = await listUsersService({
  //     logged_user_id: id,
  //     page,
  //     limit,
  //     filter_by_id,
  //     filter_by_name,
  //     filter_by_company_id: company_id,
  //   });

  //   if (!permissions.includes(ADMIN)) {
  //     users.users = users.users.filter(
  //       (item) => !item.permissions.includes(ADMIN)
  //     );
  //   }

  //   const response = {
  //     ...users,
  //     users: users.users.map((item) => {
  //       const { user_password, updated_at, company, ...rest } = item;
  //       return rest;
  //     }),
  //   };

  //   return res.json(response);
  // },

  // async getById(req: Request, res: Response) {
  //   const id = parseInt(req.params.id);
  //   const { company_id } = req.authenticated_user;

  //   const selectedUser = await getUserByIdService({
  //     id,
  //     filter_by_company_id: company_id,
  //   });

  //   if (!selectedUser) return res.status(404).json({});

  //   const { user_password, updated_at, ...rest } = selectedUser;

  //   return res.json(rest);
  // },

  // async update(req: Request, res: Response) {
  //   const id = parseInt(req.params.id);
  //   const body = req.body as UpdateUserBody;
  //   const { permissions, user_login, email } = body;
  //   const { permissions: loggedUserPermissions, company_id } =
  //     req.authenticated_user;
  //   const { file } = req;

  //   if (permissions) {
  //     canApplyPermissions(loggedUserPermissions, permissions);
  //   }

  //   if (user_login) {
  //     const selectedUser = await getUserByUsernameService({ user_login });

  //     if (selectedUser && selectedUser.id !== id) {
  //       return res
  //         .status(USERNAME_ALREADY_USED.code)
  //         .json({ message: USERNAME_ALREADY_USED.message });
  //     }
  //   }

  //   if (email) {
  //     const selectedUser = await getUserByEmailService({ email });

  //     if (selectedUser && selectedUser.id !== id) {
  //       return res
  //         .status(EMAIL_ALREADY_USED.code)
  //         .json({ message: EMAIL_ALREADY_USED.message });
  //     }
  //   }

  //   const payload = {
  //     ...body,
  //     file,
  //     id,
  //     filter_by_company_id: company_id,
  //   } as UpdateUserPayload;

  //   const { count } = await updateUserService(payload);
  //   if (!count) {
  //     return res
  //       .status(NOT_UPDATED_NOT_FOUND.code)
  //       .json({ message: NOT_UPDATED_NOT_FOUND.message });
  //   }

  //   return res.status(204).json({});
  // },

  // async delete(req: Request, res: Response) {
  //   const id = parseInt(req.params.id);
  //   const { id: loggedUserId, company_id } = req.authenticated_user;

  //   if (id === loggedUserId) {
  //     return res
  //       .status(CAN_NOT_DELETE_YOURSELF.code)
  //       .json({ message: CAN_NOT_DELETE_YOURSELF.message });
  //   }

  //   const { count } = await deleteUserService({
  //     id,
  //     filter_by_company_id: company_id,
  //   });
  //   if (!count) {
  //     return res
  //       .status(NOT_DELETE_NOT_FOUND.code)
  //       .json({ message: NOT_DELETE_NOT_FOUND.message });
  //   }

  //   return res.status(204).json({});
  // },
};

export { userController };
