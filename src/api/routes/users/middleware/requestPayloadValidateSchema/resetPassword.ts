import Joi from "joi";

const resetPasswordSchema = Joi.object({
  user_login: Joi.string().required(),
  language: Joi.string().valid('pt', 'en').required(),
});

export { resetPasswordSchema };