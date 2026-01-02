import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createTestUsers() {
  console.log("🚀 Creando usuarios de prueba para desarrollo...");

  try {
    // Hashear contraseñas
    const hashedAdminPassword = await bcrypt.hash("admin123456", 10);
    const hashedUserPassword = await bcrypt.hash("user123456", 10);

    // Crear administrador de prueba
    const admin = await prisma.user.upsert({
      where: { email_address: "admin@test.com" },
      update: {},
      create: {
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
    const user = await prisma.user.upsert({
      where: { email_address: "user@test.com" },
      update: {},
      create: {
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

    console.log("✅ Usuarios de prueba creados exitosamente!");
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
    console.log("\n💡 Usa estos usuarios para probar:");
    console.log("   • El formulario de login");
    console.log("   • El comportamiento del navbar según el rol");
    console.log("   • La navegación condicional (admin vs usuario)");

  } catch (error) {
    console.error("❌ Error creando usuarios de prueba:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createTestUsers();
}

export { createTestUsers };
