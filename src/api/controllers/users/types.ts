export type CreateUserBody = {
  name: string;
  email: string;
  user_login: string;
  user_password: string;
  image_url: string;
  image_key: string;
};

export type UpdateUserBody = {
  id: number;
  name?: string;
  email?: string;
  user_login?: string;
  user_password?: string;
  image_url?: string;
  image_key?: string;
};

export type LoginBody = {
  user_login: string;
  user_password: string;
};

export type UpdatePasswordBody = {
  old_password: string;
  new_password: string;
};

export type ResetPasswordBody = {
  user_login: string;
  language: string;
};

export type UpdateResetedPasswordBody = {
  new_password: string;
  token: string;
};
