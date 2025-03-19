import Joi from "joi";

const updateSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string(),
  description: Joi.string(),
  points: Joi.number().integer().positive(),
  event_date: Joi.date(),
  include_user_ids: Joi.array().items(Joi.number().integer().positive()).optional(),
  exclude_user_ids: Joi.array().items(Joi.number().integer().positive()).optional(),
});

export { updateSchema };
