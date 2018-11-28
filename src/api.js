const bonita = require('./bonita');

const handle = fn => (req, res, next) => fn(req, res, next).catch(next);

const resolvers = {};

const forCase = caseId =>
  new Promise((resolve, reject) => {
    resolvers[caseId] = resolve;
  });

const resolve = caseId => resolvers[caseId];

module.exports = app => {
  app.get(
    '/products-list',
    handle(async (req, res) => {
      const credentials = await bonita.login();
      const processId = await bonita.getProcess(credentials, 'pool3');
      const variables = [
        {
          name: "token",
          value: ""
        }
      ]
      const caseId = await bonita.initiate(credentials, processId, variables);

      const list = await forCase(caseId);

      res.json(list);
    })
  );

  app.put(
    '/resolve',
    handle(async (req, res) => {
      resolve(req.headers.caseid)(req.body);
    })
  );
};
