const status = require('http-status');
const validate = require('express-validation');
const path = require('path');

const handle = fn => (req, res, next) => fn(req, res, next).catch(next);

module.exports = app => (base, controller, validator) => {
  app.get(
    base,
    validate(validator.all),
    handle(async (req, res) => {
      res.status(status.OK).json(await controller.all(req.query));
    })
  );

  app.post(
    base,
    validate(validator.create),
    handle(async (req, res) => {
      res.status(status.CREATED).json(await controller.create(req.body));
    })
  );

  app.get(
    path.join(base, ':id'),
    validate(validator.get),
    handle(async (req, res) => {
      const { id } = req.params;
      res.status(status.OK).json(await controller.get(id));
    })
  );

  app.put(
    path.join(base, ':id'),
    validate(validator.update),
    handle(async (req, res) => {
      const {
        body,
        params: { id }
      } = req;
      res.status(status.OK).json(await controller.update(id, body));
    })
  );

  app.patch(
    path.join(base, ':id'),
    validate(validator.patch),
    handle(async (req, res) => {
      const {
        body,
        params: { id }
      } = req;
      res.status(status.OK).json(await controller.update(id, body));
    })
  );

  app.delete(
    path.join(base, ':id'),
    validate(validator.delete),
    handle(async (req, res) => {
      const { id } = req.params;
      res.status(status.OK).json(await controller.delete(id));
    })
  );
};
