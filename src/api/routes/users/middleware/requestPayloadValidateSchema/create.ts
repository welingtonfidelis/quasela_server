import Joi from "joi";

const createSchema = Joi.object({
  name: Joi.string().required(),
  user_login: Joi.string().required(),
  email: Joi.string().email().required(),
  user_password: Joi.string().min(3).required(),
});

export { createSchema };
