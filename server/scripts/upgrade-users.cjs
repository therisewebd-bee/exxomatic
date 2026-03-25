import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function upgradeAllUsers() {
  try {
    const updated = await prisma.user.updateMany({
      data: {
        role: 'Admin'
      }
    });
    console.log(`[Success] Upgraded ${updated.count} users to Admin role.`);
  } catch (err) {
    console.error(`[Error] Failed to upgrade users:`, err);
  } finally {
    await prisma.$disconnect();
  }
}

upgradeAllUsers();
