const jwt = require("jsonwebtoken");

const validateUserToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "no token, auth denied" });
    }
    const decodedToken = jwt.verify(token, config.jwtSecret);
    req.user = decodedToken.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Auth failed!" });
  }
};
const validateAdminToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "no token, auth denied" });
    }
    const decodedToken = jwt.verify(token, config.jwtSecret);
    if (decodedToken.user.role !== "Admin") {
      return res.status(401).json({ msg: "admin permission, auth denied" });
    }
    req.user = decodedToken.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Auth failed!" });
  }
};

module.exports = {
  validateAdminToken,
  validateUserToken,
};
