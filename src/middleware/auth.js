const createError = require("http-errors");

const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
      req.decoded = decoded;
      next();
    } else {
      next(createError(400, "server need token"));
    }
  } catch (error) {
    console.log(error.name);
    // console.log(error);
    if (error && error.name === "JsonWebTokenError") {
      next(createError(400, "token invalid"));
    } else if (error && error.name === "TokenExpiredError") {
      next(createError(400, "token expired"));
    } else {
      next(createError(400, "Token not active"));
    }
  }
};

const generateToken = (payload) => {
  const verifyOpts = {
    expiresIn: "1h"
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, verifyOpts);
  return token;
};

const gerateRefreshToken = (payload) => {
  const verifyOpts = {
    expiresIn: "1 day"
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, verifyOpts);
  return token;
};

module.exports = { generateToken, gerateRefreshToken, protect };
