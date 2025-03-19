export type CreateUserData = {
  name: string;
  email: string;
  user_login: string;
  user_password: string;
  image_url: string;
  image_key: string;
};

export type UpdateUserData = {
  id: number;
  name?: string;
  email?: string;
  user_login?: string;
  user_password?: string;
  image_url?: string;
  image_key?: string;
};

export type FindUserByIdData = {
  id: number;
};

export type FindUserByUserLoginData = {
  user_login: string;
};

export type FindUserByEmailData = {
  email: string;
};

export type FindUserByUsernameOrEmailData = {
  user_login: string;
  email: string;
};
