const { prisma } = require("../../utilities/prisma");
const bcrypt = require("bcrypt");

const createUser = async (req) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  return await prisma.users.create({
    data: {
      email: req.body.email,
      username: req.body.username,
      password: hashPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
  });
};

const findAllUsers = async () => {
  return await prisma.users.findMany();
};

const findUserById = async (id) => {
  return await prisma.users.findFirst({
    where: {
      id: id,
    },
  });
};

const findUserByEmail = async (req) => {
  return await prisma.users.findFirst({
    where: {
      email: req.body.email,
    },
  });
};

const updateUser = async (id, req) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  return await prisma.users.update({
    where: {
      id: id,
    },
    data: {
      email: req.body.email,
      username: req.body.username,
      password: hashPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
  });
};

const deleteUser = async (id) => {
  return await prisma.users.delete({
    where: {
      id: id,
    },
  });
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  findAllUsers,
  updateUser,
  deleteUser,
};
