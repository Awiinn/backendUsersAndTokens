const jwt = require("jsonwebtoken");
const { findUserById } = require("../api/users/usersServices");

const getUserInfo = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).send({
      message: "Unauthorized!",
    });
  }
  try {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await findUserById(payload.id);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized!!");
  }
};

const isAuthenticated = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).send({
      message: "Unauthorized!!!",
    });
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.payload = payload;
    next();
  } catch (error) {
    res.status(401);
    if (error.name === "TokenExpiredError") {
      return res.status(401).send("Token expired.");
    }
    return res.status(401).send("Unauthorized!!!!");
  }
};

const isAdmin = (req, res, next) => {
  const user = req.user;
  if (!user || !user.admin) {
    return res.status(401).send("Access denied. Admin access required.");
  }
  next();
};

module.exports = {
  isAuthenticated,
  isAdmin,
  getUserInfo,
};
