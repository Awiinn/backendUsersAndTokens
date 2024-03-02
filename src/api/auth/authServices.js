const { prisma } = require("../../utilities/prisma");
const { hashToken } = require("../../utilities/hashToken");

const addRefreshToken = async ({ jti, refreshToken, userId }) => {
  const hashedToken = await hashToken(refreshToken);
  return await prisma.refreshTokens.create({
    data: {
      id: jti,
      hashedToken,
      userId,
    },
  });
};

const findRefreshTokenById = async (id) => {
  return await prisma.refreshTokens.findFirst({
    where: {
      id: id,
    },
  });
};

const deleteRefreshToken = async (id) => {
  return await prisma.refreshTokens.update({
    where: {
      id: id,
    },
    data: {
      revoked: true,
    },
  });
};

const revokeRefreshToken = async (userId) => {
  return await prisma.refreshTokens.updateMany({
    where: {
      userId: userId,
    },
    data: {
      revoked: true,
    },
  });
};

module.exports = {
  addRefreshToken,
  findRefreshTokenById,
  deleteRefreshToken,
  revokeRefreshToken,
};
