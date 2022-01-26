const parseId = async (req, res, next) => {
  const parsedId = parseInt(req.params.id);

  //bad request
  if (!parsedId) return res.status(400).end();
  req.params.id = parsedId;

  next();
};

module.exports = { parseId };
