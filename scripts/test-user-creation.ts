import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function testUserCreation() {
  console.log("🧪 Test directo de creación y verificación de usuarios...");

  try {
    // Limpiar usuarios existentes primero
    await prisma.user.deleteMany({
      where: {
        email_address: {
          in: ["admin@test.com", "user@test.com"]
        }
      }
    });
    console.log("✅ Usuarios anteriores eliminados");

    // Crear contraseñas hasheadas
    const adminPassword = "admin123456";
    const userPassword = "user123456";

    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
    const hashedUserPassword = await bcrypt.hash(userPassword, 10);

    console.log("🔐 Contraseñas hasheadas:");
    console.log(`   Admin: ${adminPassword} → ${hashedAdminPassword.substring(0, 20)}...`);
    console.log(`   User: ${userPassword} → ${hashedUserPassword.substring(0, 20)}...`);

    // Crear usuarios
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

    console.log("✅ Usuarios creados exitosamente");
    console.log(`   Admin ID: ${admin.user_id}`);
    console.log(`   User ID: ${user.user_id}`);

    // Verificar que las contraseñas funcionen
    console.log("\n🔍 Verificando contraseñas...");

    const isAdminValid = await bcrypt.compare(adminPassword, admin.password);
    const isUserValid = await bcrypt.compare(userPassword, user.password);

    console.log(`   Admin password válida: ${isAdminValid ? '✅' : '❌'}`);
    console.log(`   User password válida: ${isUserValid ? '✅' : '❌'}`);

    if (isAdminValid && isUserValid) {
      console.log("\n🎉 ¡Usuarios creados y validados correctamente!");
      console.log("\n📋 Credenciales finales:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("👑 ADMINISTRADOR:");
      console.log(`   Email: admin@test.com`);
      console.log(`   Contraseña: admin123456`);
      console.log("");
      console.log("👤 USUARIO REGULAR:");
      console.log(`   Email: user@test.com`);
      console.log(`   Contraseña: user123456`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    } else {
      console.log("\n❌ Error en la validación de contraseñas");
    }

  } catch (error) {
    console.error("❌ Error durante el test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testUserCreation();
}

export { testUserCreation };
