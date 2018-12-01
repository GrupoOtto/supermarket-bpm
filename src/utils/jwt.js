const jwt = require('jwt-decode');

const regex = /(\S+)\s+(\S)/

exports.extract = request => {
  const { authorization } = request.headers;
  if(!authorization) return null;

  const token = authorization.match(regex)[2];
  if(!token) return null;

  try {
    return jwt(token).sub;
  } catch (error) {
    console.error(error);
    return null;
  }

}
