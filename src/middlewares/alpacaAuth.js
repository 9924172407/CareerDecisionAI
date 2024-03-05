const auth = require('basic-auth');

const alpacaAuthMiddleware = (req, res, next) => {
  const user = auth(req);

  if (!user || user.name !== process.env.ALPACA_API || user.pass !== process.env.API_KEY) {
    res.status(401).json({ message: 'Unauthorized for Alpaca API' });
  } else {
    next();
  }
};

module.exports = alpacaAuthMiddleware;
