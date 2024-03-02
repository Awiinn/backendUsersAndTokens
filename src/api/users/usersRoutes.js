const router = require("express").Router();
const bcrypt = require("bcrypt");
const {
  getUserInfo,
  isAuthenticated,
  isAdmin,
} = require("../../utilities/middleware");
const {
  findUserById,
  findAllUsers,
  updateUser,
  deleteUser,
} = require("./usersServices");

// GET - /api/users
router.get(
  "/",
  getUserInfo,
  isAuthenticated,
  isAdmin,
  async (req, res, next) => {
    try {
      const users = await findAllUsers();
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);

// GET - /api/users/profile (get user by id)
router.get("/profile", isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await findUserById(userId);
    delete user.password;
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// PUT - /api/users/profile/update
router.put("/profile/update", isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await updateUser(userId);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

// DELETE - /api/users/profile/delete
router.delete("/profile/delete", isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.body;
    const deletedUser = await deleteUser(userId);
    if (!deletedUser) {
      return res.status(401).send({
        message: "Error deleting user.",
      });
    }
    res.status(200).send({
      message: "User deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
