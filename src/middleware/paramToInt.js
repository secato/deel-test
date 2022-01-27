const { BadRequest } = require('http-errors');

/**
 * Try to parse path param to integer, otherwise throw BadRequest
 * @param {string} paramName
 * @returns
 */
const paramToInt = (paramName) => (req, res, next) => {
  const parsedId = parseInt(req.params[paramName]);

  try {
    if (!parsedId) throw new BadRequest('invalid path param');
    req.params[paramName] = parsedId;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { paramToInt };
