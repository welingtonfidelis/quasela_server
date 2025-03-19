import Joi from "joi";

const updateSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string(),
  description: Joi.string(),
  goal_value: Joi.number().integer().positive(),
  include_user_ids: Joi.array().items(Joi.number().integer().positive()).optional(),
  exclude_user_ids: Joi.array().items(Joi.number().integer().positive()).optional(),
});

export { updateSchema };
