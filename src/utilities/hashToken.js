const bcrypt = require("bcrypt");

const hashToken = async (token) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedToken = await bcrypt.hash(token, salt);
    return hashedToken;
  } catch (error) {
    console.error("Error hashing token:", error);
    throw error;
  }
};

module.exports = { hashToken };
