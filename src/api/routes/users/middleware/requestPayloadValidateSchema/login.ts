import Joi from "joi";

const loginSchema = Joi.object({
  user_login: Joi.string().required(),
  user_password: Joi.string().required(),
});

export { loginSchema };