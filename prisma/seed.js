require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing grades
  await prisma.grade.deleteMany();

  // Create grades
  const grades = await prisma.grade.createMany({
    data: [
      { level: 1 },
      { level: 2 },
      { level: 3 },
      { level: 4 },
      { level: 5 },
      { level: 6 },
      { level: 7 },
      { level: 8 },
      { level: 9 },
      { level: 10 },
      { level: 11 },
      { level: 12 },
    ],
  });

  console.log(`${grades.count} grades created`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
