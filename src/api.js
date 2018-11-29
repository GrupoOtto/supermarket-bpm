const bonita = require('./bonita');
const status = require('http-status');
const error = require('http-errors');

const handle = fn => (req, res, next) => fn(req, res, next).catch(next);

const resolvers = {};

const forCase = caseId =>
  new Promise((resolve, reject) => {
    resolvers[caseId] = { resolve, reject };
  });

const resolve = caseId => resolvers[caseId].resolve;
const reject = caseId => resolvers[caseId].reject;

module.exports = app => {
  app.get(
    '/products-list',
    handle(async (req, res) => {
      const credentials = await bonita.login();
      const processId = await bonita.getProcess(credentials, 'pool3');
      const variables = [{ name: 'token', value: req.headers.authorization }];
      const caseId = await bonita.initiate(credentials, processId, variables);
      console.log('[BONITA] Started case id', caseId);

      const list = await forCase(caseId);

      res.json(list);
    })
  );

  app.get(
    '/prepare-sale',
    handle(async (req, res) => {
      const credentials = await bonita.login();
      const processId = await bonita.getProcess(credentials, 'prepare-sale');
      const variables = [
        { name: 'token', value: req.headers.authorization },
        { name: 'productsCart', value: req.body.productsCart },
        { name: 'couponCode', value: req.body.couponCode || '' }
      ];
      const caseId = await bonita.initiate(credentials, processId, variables);
      console.log('[BONITA] Started case id', caseId);

      const list = await forCase(caseId);

      res.json(list);
    })
  );

  app.put(
    '/resolve',
    handle(async (req, res) => {
      resolve(req.headers.caseid)(req.body);
      res.status(status.OK).json({ message: 'Case finished' });
    })
  );

  app.put(
    '/reject',
    handle(async (req, res) => {
      reject(req.headers.caseid)(
        error(req.body.status || 500, req.body.message || 'Internal error')
      );
    })
  );
};
