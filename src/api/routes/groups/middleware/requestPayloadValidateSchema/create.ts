import Joi from "joi";

const createSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  goal_value: Joi.number().integer().positive().required(),
});

export { createSchema };
