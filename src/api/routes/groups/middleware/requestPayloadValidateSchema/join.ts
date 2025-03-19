import Joi from "joi";

const joinSchema = Joi.object({
  uuid: Joi.string().uuid().required(),
});

export { joinSchema };
