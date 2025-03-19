import Joi from "joi";

const getByIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  include_users: Joi.boolean(),
});

export { getByIdSchema };
