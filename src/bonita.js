const axios = require('axios');
const qs = require('querystring');
const _ = require('lodash');

const doLogin = async (username, password, redirect = false) =>
  axios.post(
    'http://bonita:8080/bonita/loginservice',
    qs.stringify({ username, password, redirect }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

const member = delimiter => string => index => string.split(delimiter)[index];
const name = string => member('=')(string)(0);
const value = string => member(';')(member('=')(string)(1))(0);

const getCookies = cookies =>
  cookies
    .map(cookie => ({ [name(cookie)]: value(cookie) }))
    .reduce((cookies, cookie) => ({ ...cookies, ...cookie }), {});

const getAuthHeaders = credentials => ({
  Cookie: _.toPairs(credentials)
    .map(cookie => cookie.join('='))
    .join('; '),
  'X-Bonita-API-Token': credentials['X-Bonita-API-Token']
});

exports.login = async () => {
  const response = await doLogin('walter.bates', 'bpm');
  return getCookies(response.headers['set-cookie']);
};

exports.initiate = async (credentials, processDefinitionId, variables) => {
  const response = await axios.post(
    'http://bonita:8080/bonita/API/bpm/case',
    { processDefinitionId, variables },
    { headers: getAuthHeaders(credentials) }
  );

  return response.data.id;
};

exports.getProcess = async (credentials, processName) => {
  const response = await axios.get(
    'http://bonita:8080/bonita/API/bpm/process',
    {
      params: { s: processName },
      headers: getAuthHeaders(credentials)
    }
  );
  return response.data[0].id;
};

exports.getTask = async (credentials, caseId) => {
  const response = await axios.get('http://bonita:8080/bonita/API/bpm/task', {
    params: { f: `caseId=${caseId}` },
    headers: getAuthHeaders(credentials)
  });

  return response.data[0] ? response.data[0].id : null;
};

exports.continueTask = async (credentials, taskId) =>
  await axios.put(
    `http://bonita:8080/bonita/API/bpm/humanTask/${taskId}`,
    { state: 'skipped' },
    { headers: getAuthHeaders(credentials) }
  );

exports.setSaleInfo = async (credentials, caseId, saleInfo) =>
  await axios.put(
    `http://bonita:8080/bonita/API/bpm/caseVariable/${caseId}/saleInfoText`,
    { type: 'java.lang.String', value: JSON.stringify(saleInfo) },
    { headers: getAuthHeaders(credentials) }
  );
