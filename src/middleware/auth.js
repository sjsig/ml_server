const jwt = require("jsonwebtoken");

//make sure user is logged in (authentification)
exports.isLoggedIn = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1]; //authorization is set up as such: Bearer token
    jwt.verify(token, process.env.AUTH_SECRET, function (err, decoded) {
      if (decoded) {
        return next();
      } else {
        return next({
          status: 401,
          message: "Please log in first",
        });
      }
    });
  } catch (error) {
    return next({
      status: 401,
      message: "Please log in first",
    });
  }
};

//make sure we ge the correct user (authorization) or an admin
exports.isAuthorized = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.AUTH_SECRET, function (err, decoded) {
      if (decoded) {
        if (decoded.is_admin == 1 || `${decoded.id}` === req.params.userId) {
          return next();
        } else {
          return next({
            status: 401,
            message: "Unauthorized",
          });
        }
      }
    });
  } catch (err) {
    return next({
      status: 401,
      message: "Unauthorized",
    });
  }
};

exports.isAdmin = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.AUTH_SECRET, function (err, decoded) {
      if (decoded) {
        if (decoded.is_admin == 1) {
          return next();
        } else {
          return next({
            status: 401,
            message: "You must have admin privledges to do that",
          });
        }
      }
    });
  } catch (e) {
    return next({
      status: 401,
      message: "You must have admin privledges to do that",
    });
  }
};
