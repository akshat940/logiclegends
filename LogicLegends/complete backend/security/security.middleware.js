const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per IP
  message: 'Too many requests, please try again later.',
});

function securityMiddleware(req, res, next) {
  helmet()(req, res, () => {
    mongoSanitize()(req, res, () => {
      xss()(req, res, () => {
        limiter(req, res, next);
      });
    });
  });
}

module.exports = securityMiddleware;
