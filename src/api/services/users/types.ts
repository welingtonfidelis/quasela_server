import { Role } from "@prisma/client";

export type CreateUserPayload = {
  name: string;
  email: string;
  user_login: string;
  user_password: string;
  image_url: string;
  image_key: string;
};

export type UpdateUserPayload = {
  id: number;
  name?: string;
  email?: string;
  user_login?: string;
  user_password?: string;
  image_url?: string;
  image_key?: string;
  is_blocked?: boolean;
  permissions?: Role[];
  delete_image?: boolean;
  file?: Express.Multer.File;
};

export type UpdatePasswordPayload = {
  id: number;
  company_id: number;
  new_password: string;
};

export type ResetPasswordPayload = {
  id: number;
  company_id: number;
  language: string;
  name: string;
  email: string;
};

export type UpdateResetedPasswordPayload = {
  id: number;
  new_password: string;
};

export type FindUserByIdPayload = {
  id: number;
  filter_by_company_id?: number;
};

export type FindUserByUsernamePayload = {
  user_login: string;
  filter_by_company_id?: number;
};

export type FindUserByEmailPayload = {
  email: string;
  filter_by_company_id?: number;
};

export type FindUserByUsernameOrEmailPayload = {
  user_login: string;
  email: string;
};
