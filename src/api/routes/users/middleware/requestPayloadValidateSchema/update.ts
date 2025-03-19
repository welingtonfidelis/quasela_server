import Joi from "joi";

const updateSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string(),
  user_login: Joi.string(),
  email: Joi.string().email(),
  user_password: Joi.string().min(3),
  delete_image: Joi.boolean(),
});

export { updateSchema };
