const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const {
  findUserByEmail,
  createUser,
  findUserById,
} = require("../users/usersServices");
const {
  addRefreshToken,
  findRefreshTokenById,
  deleteRefreshToken,
  revokeRefreshToken,
} = require("./authServices");
const { generateTokens } = require("../../utilities/jwt");
const { hashToken } = require("../../utilities/hashToken");

// POST - api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(401).send({
        message: "You must provide an email and password.",
      });
    }

    const existingUser = await findUserByEmail(req);
    if (existingUser) {
      res.status(401).send({
        message: "There is already an account with that email.",
      });
    }

    const user = await createUser(req);
    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshToken({ jti, refreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken,
      message: "Register success!",
    });
  } catch (error) {
    next(error);
  }
});

// POST - api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(401).send({
        message: "You must provide an email and password.",
      });
    }

    const existingUser = await findUserByEmail(req);
    if (!existingUser) {
      res.status(401).send({
        message: "Invalid email, no account with that email exists.",
      });
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      res.status(401).send({
        message: "Invalid password.",
      });
    }
    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(existingUser, jti);
    await addRefreshToken({
      jti,
      refreshToken,
      userId: existingUser.id,
    });

    res.json({
      accessToken,
      refreshToken,
      message: "Login Succcess!",
    });
  } catch (error) {
    next(error);
  }
});

// POST - /api/auth/logout
router.post("/logout", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(401).send({
        message: "Missing or invalid token.",
      });
    }
    const deletedToken = await deleteRefreshToken(refreshToken);
    if (!deletedToken) {
      res.status(401).send({
        message: "Error deleting token.",
      });
    }
    res.status(200).send({
      message: "Logout Successful!",
    });
  } catch (error) {
    next(error);
  }
});

// POST - api/auth/refreshToken
router.post("/refreshToken", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(401).send({
        message: "Missing refresh token.",
      });
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const savedRefreshToken = await findRefreshTokenById(payload.jti);
    if (!savedRefreshToken) {
      res.status(401).send({
        message: "Unauthorized. Not saved Token.",
      });
    }

    const hashedToken = await hashToken(savedRefreshToken.hashedToken);
    const validHashedToken = await bcrypt.compare(
      hashedToken,
      savedRefreshToken.hashedToken
    );
    if (!validHashedToken) {
      res.status(401).send({
        message: "Unauthorized. Token doesnt match.",
      });
    }

    const user = await findUserById(payload.id);
    if (!user) {
      res.status(401).send({
        message: "Unauthorized. Not user.",
      });
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jti = uuidv4();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user,
      jti
    );
    await addRefreshToken({
      jti,
      refreshToken: newRefreshToken,
      userId: user.id,
    });

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
      message: "Token refresh success!",
    });
  } catch (error) {
    next(error);
  }
});

// Call this when you want to invalidate all tokens (like in the case of a password reset)

// POST - api / auth / revokeRefreshToken;
// router.post("/revokeRefreshToken", async (req, res, next) => {
//   try {
//     const { userId } = req.body;
//     await revokeRefreshToken(userId);
//     res.json({
//       message: `Tokens revoked for user id #${userId}`,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
