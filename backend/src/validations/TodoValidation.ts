import joi from 'joi';

export const createTodoValidation = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
});

export const updateTodoValidation = joi.object({
  id: joi.string().required(),
  status: joi.string().required(),
});
