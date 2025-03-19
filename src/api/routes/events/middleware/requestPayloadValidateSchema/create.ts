import Joi from "joi";

const createSchema = Joi.object({
  group_id: Joi.number().integer().positive().required(),
  name: Joi.string().required(),
  description: Joi.string(),
  points: Joi.number().integer().positive().required(),
  event_date: Joi.date().required(),
  user_ids: Joi.array().items(Joi.number().integer().positive()).optional(),
});

export { createSchema };
