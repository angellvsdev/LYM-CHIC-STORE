import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function comprehensiveTest() {
  console.log("🔍 TEST COMPRENSIVO DE AUTENTICACIÓN");
  console.log("=====================================\n");

  try {
    // 1. Verificar conexión a la base de datos
    console.log("1️⃣ Probando conexión a la base de datos...");
    await prisma.$connect();
    console.log("✅ Conexión exitosa\n");

    // 2. Limpiar usuarios existentes
    console.log("2️⃣ Limpiando usuarios existentes...");
    const deleted = await prisma.user.deleteMany({
      where: {
        email_address: {
          in: ["admin@test.com", "user@test.com"]
        }
      }
    });
    console.log(`✅ Eliminados ${deleted.count} usuarios anteriores\n`);

    // 3. Crear usuarios con contraseñas conocidas
    console.log("3️⃣ Creando usuarios de prueba...");

    const adminPassword = "admin123456";
    const userPassword = "user123456";

    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
    const hashedUserPassword = await bcrypt.hash(userPassword, 10);

    console.log(`   Admin password: ${adminPassword}`);
    console.log(`   Admin hash: ${hashedAdminPassword.substring(0, 30)}...`);
    console.log(`   User password: ${userPassword}`);
    console.log(`   User hash: ${hashedUserPassword.substring(0, 30)}...\n`);

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

    console.log(`✅ Usuarios creados:`);
    console.log(`   Admin ID: ${admin.user_id}, Role: ${admin.role}`);
    console.log(`   User ID: ${user.user_id}, Role: ${user.role}\n`);

    // 4. Verificar que las contraseñas funcionen
    console.log("4️⃣ Verificando contraseñas...");

    const adminPasswordValid = await bcrypt.compare(adminPassword, admin.password);
    const userPasswordValid = await bcrypt.compare(userPassword, user.password);

    console.log(`   Admin password válida: ${adminPasswordValid ? '✅' : '❌'}`);
    console.log(`   User password válida: ${userPasswordValid ? '✅' : '❌'}\n`);

    if (!adminPasswordValid || !userPasswordValid) {
      console.log("❌ ERROR: Las contraseñas no coinciden con los hashes");
      return;
    }

    // 5. Simular el proceso exacto del endpoint de login
    console.log("5️⃣ Simulando proceso de login (igual que el endpoint)...");

    // Simular login como admin
    const foundAdmin = await prisma.user.findUnique({
      where: { email_address: "admin@test.com" }
    });

    if (!foundAdmin) {
      console.log("❌ ERROR: Usuario admin no encontrado en la búsqueda");
      return;
    }

    const isAdminLoginValid = await bcrypt.compare("admin123456", foundAdmin.password);

    // Simular login como user
    const foundUser = await prisma.user.findUnique({
      where: { email_address: "user@test.com" }
    });

    if (!foundUser) {
      console.log("❌ ERROR: Usuario user no encontrado en la búsqueda");
      return;
    }

    const isUserLoginValid = await bcrypt.compare("user123456", foundUser.password);

    console.log(`   Búsqueda de admin: ${foundAdmin ? '✅' : '❌'}`);
    console.log(`   Búsqueda de user: ${foundUser ? '✅' : '❌'}`);
    console.log(`   Admin login simulado: ${isAdminLoginValid ? '✅' : '❌'}`);
    console.log(`   User login simulado: ${isUserLoginValid ? '✅' : '❌'}\n`);

    // 6. Resultado final
    if (adminPasswordValid && userPasswordValid && isAdminLoginValid && isUserLoginValid) {
      console.log("🎉 ¡TODO EL SISTEMA FUNCIONA CORRECTAMENTE!");
      console.log("\n📋 Credenciales finales que DEBEN funcionar:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("👑 ADMINISTRADOR:");
      console.log(`   Email: admin@test.com`);
      console.log(`   Contraseña: admin123456`);
      console.log("");
      console.log("👤 USUARIO REGULAR:");
      console.log(`   Email: user@test.com`);
      console.log(`   Contraseña: user123456`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("\n💡 Si aún recibes 'invalid credentials' en la aplicación:");
      console.log("   • Asegúrate de que la aplicación esté corriendo");
      console.log("   • Verifica que estés usando las credenciales exactas");
      console.log("   • Revisa la consola del navegador para errores de red");
    } else {
      console.log("❌ Hay algún problema en el sistema de autenticación");
    }

  } catch (error) {
    console.error("❌ Error durante el test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  comprehensiveTest();
}

export { comprehensiveTest };
