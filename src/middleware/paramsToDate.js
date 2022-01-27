const { BadRequest } = require('http-errors');

const queryToDate =
  (...params) =>
  (req, res, next) => {
    try {
      for (const [key, value] of Object.entries(req.query)) {
        if (params.includes(key)) {
          if (!Date.parse(value)) throw new BadRequest('Invalid date query param');
          req.query[key] = new Date(value);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };

module.exports = { queryToDate };
