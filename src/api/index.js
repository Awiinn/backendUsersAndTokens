const router = require("express").Router();

router.use("/users", require("./users/usersRoutes"));
router.use("/auth", require("./auth/authRoutes"));

module.exports = router;
