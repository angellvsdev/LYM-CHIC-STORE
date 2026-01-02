import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function finalVerification() {
  console.log("🔬 VERIFICACIÓN FINAL DEL SISTEMA DE AUTENTICACIÓN");
  console.log("================================================\n");

  try {
    // 1. Verificar usuarios en la base de datos
    console.log("1️⃣ Verificando usuarios en la base de datos...");

    const admin = await prisma.user.findUnique({
      where: { email_address: "admin@test.com" },
      select: {
        user_id: true,
        name: true,
        email_address: true,
        password: true,
        role: true,
        registration_date: true
      }
    });

    const user = await prisma.user.findUnique({
      where: { email_address: "user@test.com" },
      select: {
        user_id: true,
        name: true,
        email_address: true,
        password: true,
        role: true,
        registration_date: true
      }
    });

    console.log(`   Admin encontrado: ${admin ? '✅' : '❌'}`);
    console.log(`   User encontrado: ${user ? '✅' : '❌'}\n`);

    if (!admin || !user) {
      console.log("❌ Usuarios no encontrados. Ejecuta: npm run db:direct-users");
      return;
    }

    // 2. Verificar contraseñas
    console.log("2️⃣ Verificando contraseñas...");

    const adminPasswordValid = await bcrypt.compare("admin123456", admin.password);
    const userPasswordValid = await bcrypt.compare("user123456", user.password);

    console.log(`   Admin password válida: ${adminPasswordValid ? '✅' : '❌'}`);
    console.log(`   User password válida: ${userPasswordValid ? '✅' : '❌'}\n`);

    if (!adminPasswordValid || !userPasswordValid) {
      console.log("❌ Error en las contraseñas. Recreando usuarios...");
      await prisma.user.deleteMany({
        where: { email_address: { in: ["admin@test.com", "user@test.com"] } }
      });

      const hashedAdminPassword = await bcrypt.hash("admin123456", 12);
      const hashedUserPassword = await bcrypt.hash("user123456", 12);

      await prisma.user.create({
        data: {
          name: "Admin Final",
          email_address: "admin@test.com",
          password: hashedAdminPassword,
          phone_number: "123456789",
          registration_date: new Date(),
          role: "admin"
        }
      });

      await prisma.user.create({
        data: {
          name: "User Final",
          email_address: "user@test.com",
          password: hashedUserPassword,
          phone_number: "987654321",
          registration_date: new Date(),
          role: "user"
        }
      });

      console.log("✅ Usuarios recreados con contraseñas válidas\n");
    }

    // 3. Simular proceso completo de login
    console.log("3️⃣ Simulando proceso completo de login...");

    // Buscar usuario (como hace el endpoint)
    const testAdmin = await prisma.user.findUnique({
      where: { email_address: "admin@test.com" }
    });

    if (!testAdmin) {
      console.log("❌ Usuario no encontrado durante búsqueda");
      return;
    }

    // Comparar contraseña (como hace el endpoint)
    const isValidLogin = await bcrypt.compare("admin123456", testAdmin.password);

    console.log(`   Usuario encontrado: ✅`);
    console.log(`   Contraseña válida: ${isValidLogin ? '✅' : '❌'}`);
    console.log(`   Rol del usuario: ${testAdmin.role}\n`);

    // 4. Resultado final
    if (admin && user && adminPasswordValid && userPasswordValid && isValidLogin) {
      console.log("🎉 ¡SISTEMA DE AUTENTICACIÓN COMPLETAMENTE FUNCIONAL!");
      console.log("\n📋 CREDENCIALES CONFIRMADAS:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("👑 ADMINISTRADOR:");
      console.log("   ✅ Email: admin@test.com");
      console.log("   ✅ Contraseña: admin123456");
      console.log("   ✅ Rol: admin");
      console.log("");
      console.log("👤 USUARIO REGULAR:");
      console.log("   ✅ Email: user@test.com");
      console.log("   ✅ Contraseña: user123456");
      console.log("   ✅ Rol: user");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("\n🚀 PASOS PARA PROBAR:");
      console.log("   1. Inicia la aplicación: npm run dev");
      console.log("   2. Ve a: http://localhost:3000/login");
      console.log("   3. Prueba las credenciales de arriba");
      console.log("   4. Verifica que el navbar cambie según el rol");
      console.log("\n💡 Si aún recibes 'invalid credentials':");
      console.log("   • Revisa la consola del navegador (F12)");
      console.log("   • Busca errores de red o JavaScript");
      console.log("   • Verifica que no haya problemas de CORS");
      console.log("   • Asegúrate de que la aplicación esté corriendo en puerto 3000");
    }

  } catch (error) {
    console.error("❌ Error durante la verificación:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  finalVerification();
}

export { finalVerification };
