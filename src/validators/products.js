const Joi = require('joi');

const numberSchema = [
  Joi.number(),
  Joi.object()
    .keys({
      $gt: Joi.number(),
      $gte: Joi.number(),
      $lt: Joi.number(),
      $lte: Joi.number()
    })
    .or('$gt', '$gte', '$lt', '$lte')
];

const stringSchema = [
  Joi.string(),
  Joi.object().keys({
    $regex: Joi.string()
  })
];

exports.all = {
  query: {
    name: stringSchema,
    costPrice: numberSchema,
    salePrice: numberSchema
  }
};

exports.create = {
  body: {
    name: Joi.string().required(),
    costPrice: Joi.number().required(),
    salePrice: Joi.number().required(),
    type: Joi.string()
      .hex()
      .required()
  }
};

exports.get = {};

exports.update = {
  body: {
    name: Joi.string().required(),
    costPrice: Joi.number().required(),
    salePrice: Joi.number().required(),
    type: Joi.string()
      .hex()
      .required()
  }
};

exports.patch = {
  body: {
    name: Joi.string(),
    costPrice: Joi.number(),
    salePrice: Joi.number(),
    type: Joi.string().hex()
  }
};

exports.delete = {};
