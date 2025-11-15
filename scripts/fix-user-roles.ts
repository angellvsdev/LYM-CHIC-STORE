import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function fixUserRoles() {
  console.log("🔧 Corrigiendo roles de usuarios...");

  try {
    // Buscar usuarios existentes
    const users = await prisma.user.findMany({
      where: {
        email_address: {
          in: ["admin@test.com", "user@test.com"]
        }
      },
      select: {
        user_id: true,
        email_address: true,
        role: true
      }
    });

    console.log(`📊 Usuarios encontrados: ${users.length}`);

    for (const user of users) {
      console.log(`   ${user.email_address}: ${user.role}`);

      // Asegurar que el administrador tenga rol 'admin'
      if (user.email_address === "admin@test.com" && user.role !== "admin") {
        await prisma.user.update({
          where: { user_id: user.user_id },
          data: { role: "admin" }
        });
        console.log(`   ✅ Corregido admin: ${user.role} → admin`);
      }

      // Asegurar que el usuario regular tenga rol 'user'
      if (user.email_address === "user@test.com" && user.role !== "user") {
        await prisma.user.update({
          where: { user_id: user.user_id },
          data: { role: "user" }
        });
        console.log(`   ✅ Corregido user: ${user.role} → user`);
      }
    }

    console.log("✅ Roles corregidos exitosamente");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  fixUserRoles();
}

export { fixUserRoles };
