const { prisma } = require("../utilities/prisma");
const bcrypt = require("bcrypt");

async function seedDatabase() {
  try {
    await prisma.users.deleteMany();
    await prisma.refreshTokens.deleteMany();

    // Reset auto-increment sequence
    // await prisma.$executeRaw`ALTER SEQUENCE users_id_seq RESTART WITH 1;`;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password", salt);

    // Users data
    const usersData = [
      {
        email: "admin@example.com",
        username: "admin",
        password: hashedPassword,
        firstName: "admin",
        lastName: "admin",
        admin: true,
      },
      {
        email: "user@example.com",
        username: "user",
        password: hashedPassword,
        firstName: "user",
        lastName: "user",
        admin: false,
      },
    ];

    // Create users
    await Promise.all(
      usersData.map((userData) => prisma.users.create({ data: userData }))
    );

    console.log("Seeding successful");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
