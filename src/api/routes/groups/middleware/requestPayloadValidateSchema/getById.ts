import Joi from "joi";

const getByIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  include_events: Joi.boolean(),
  include_users: Joi.boolean(),
});

export { getByIdSchema };
