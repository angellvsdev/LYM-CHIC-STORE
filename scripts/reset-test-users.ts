import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function resetTestUsers() {
  console.log("🔄 Reiniciando usuarios de prueba...");

  try {
    // Eliminar usuarios existentes si existen
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email_address: "admin@test.com" },
          { email_address: "user@test.com" }
        ]
      }
    });

    console.log("✅ Usuarios anteriores eliminados");

    // Hashear contraseñas
    const hashedAdminPassword = await bcrypt.hash("admin123456", 10);
    const hashedUserPassword = await bcrypt.hash("user123456", 10);

    // Crear administrador de prueba
    const admin = await prisma.user.create({
      data: {
        name: "Administrador Prueba",
        phone_number: "+1234567890",
        email_address: "admin@test.com",
        password: hashedAdminPassword,
        registration_date: new Date(),
        role: "admin",
        age: 30,
        gender: "masculino",
      },
    });

    // Crear usuario regular de prueba
    const user = await prisma.user.create({
      data: {
        name: "Usuario Prueba",
        phone_number: "+0987654321",
        email_address: "user@test.com",
        password: hashedUserPassword,
        registration_date: new Date(),
        role: "user",
        age: 25,
        gender: "femenino",
      },
    });

    console.log("✅ Nuevos usuarios de prueba creados!");
    console.log("\n📋 Credenciales de prueba:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👑 ADMINISTRADOR:");
    console.log(`   Email: admin@test.com`);
    console.log(`   Contraseña: admin123456`);
    console.log(`   ID: ${admin.user_id}`);
    console.log("");
    console.log("👤 USUARIO REGULAR:");
    console.log(`   Email: user@test.com`);
    console.log(`   Contraseña: user123456`);
    console.log(`   ID: ${user.user_id}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  } catch (error) {
    console.error("❌ Error reiniciando usuarios de prueba:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  resetTestUsers();
}

export { resetTestUsers };
