const Joi = require('joi');

exports.all = {};

exports.create = {
  body: {
    initials: Joi.string().required(),
    description: Joi.string().required()
  }
};

exports.get = {};

exports.update = {
  body: {
    initials: Joi.string().required(),
    description: Joi.string().required()
  }
};

exports.patch = {
  body: {
    initials: Joi.string(),
    description: Joi.string()
  }
};

exports.delete = {};
