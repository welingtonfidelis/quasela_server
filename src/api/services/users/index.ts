import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { resolve } from "path";

import { config } from "../../../config";
import { deleteFile, uploadImage } from "../../../shared/service/fileS3";
import { sendMail } from "../../../shared/service/mail";
import { createToken } from "../../../shared/service/token";

import { CreateUserPayload, FindUserByEmailPayload, FindUserByIdPayload, FindUserByUsernameOrEmailPayload, FindUserByUsernamePayload, UpdateUserPayload } from "./types";
import { userRepository } from "../../repositories/users";
import { UpdateUserData } from "../../repositories/users/types";

const { create, findByUserLoginOrEmail, findById, updateById,findByEmail, findByUserName } = userRepository;

const { ENCRYPT_SALT, SOURCE_EMAIL, URL_FRONT_RESET_PASSWORD, JSON_SECRET } = config;

const userService = {
  async createUser(payload: CreateUserPayload) {
    const password = bcrypt.hashSync(payload.user_password, ENCRYPT_SALT);
    const image_url = "";
    const image_key = "";

    const newUser = await create({
      ...payload,
      user_password: password,
      image_url,
      image_key,
    });

    return { ...newUser, user_password: payload.user_password };
  },

  getUserByIdService(payload: FindUserByIdPayload) {
    return findById(payload);
  },

  getUserByUsernameService(payload: FindUserByUsernamePayload) {
    return findByUserName(payload);
  },

  getUserByEmailService(payload: FindUserByEmailPayload) {
    return findByEmail(payload);
  },

  getUserByUserLoginOrEmailService(payload: FindUserByUsernameOrEmailPayload) {
    return findByUserLoginOrEmail(payload);
  },

  async updateUserService(payload: UpdateUserPayload) {
    const { id, file, delete_image } = payload;

    if (file) {
      const { Location, Key } = await uploadImage(file, `user/${id}/profile`, `user_${id}`);

      payload.image_url = Location;
      payload.image_key = Key;
    } else if (delete_image) {
      const selectedUser = await findById({ id });

      if (selectedUser && selectedUser.image_key) {
        await deleteFile(selectedUser.image_key);
      }

      payload.image_url = "";
      payload.image_key = "";
    }

    if (payload.user_password) {
      payload.user_password = bcrypt.hashSync(payload.user_password, ENCRYPT_SALT);
    }

    delete payload.delete_image;
    delete payload.file;

    return updateById(payload as UpdateUserData);
  },

  // async resetUserPasswordService(payload: ResetPasswordPayload) {
  //   const { id, company_id, name, email, language } = payload;

  //   const token = createToken({ id, company_id }, JSON_SECRET, 15);
  //   const htmlTemplate = path.resolve(__dirname, `src/shared/view/html/${language}/resetPassword.hbs`);

  //   const html = handlebars.compile(htmlTemplate)({
  //     name,
  //     link: `${URL_FRONT_RESET_PASSWORD}?token=${token}`,
  //   });

  //   return sendMail({
  //     to: [email],
  //     subject: "reset password",
  //     message: html,
  //   });
  // },

  // listUsersService(payload: ListAllPayload) {
  //   return listAll(payload);
  // },

  // deleteUserService(payload: DeleteUserByIdPayload) {
  //   return deleteById(payload);
  // },
};

export { userService };
