import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function simulateLogin() {
  console.log("🔐 Simulando proceso de login...");

  try {
    // Buscar usuarios
    const adminUser = await prisma.user.findUnique({
      where: { email_address: "admin@test.com" }
    });

    const userUser = await prisma.user.findUnique({
      where: { email_address: "user@test.com" }
    });

    if (!adminUser || !userUser) {
      console.log("❌ Usuarios no encontrados. Ejecuta primero: npm run db:test-users");
      return;
    }

    console.log("✅ Usuarios encontrados en la base de datos");

    // Simular login como administrador
    console.log("\n🔑 Probando login como administrador:");
    console.log(`   Email: ${adminUser.email_address}`);
    console.log(`   Password en BD: ${adminUser.password.substring(0, 20)}...`);

    const isAdminValid = await bcrypt.compare("admin123456", adminUser.password);
    console.log(`   Comparación: ${isAdminValid ? '✅ EXITOSA' : '❌ FALLIDA'}`);

    // Simular login como usuario regular
    console.log("\n🔑 Probando login como usuario:");
    console.log(`   Email: ${userUser.email_address}`);
    console.log(`   Password en BD: ${userUser.password.substring(0, 20)}...`);

    const isUserValid = await bcrypt.compare("user123456", userUser.password);
    console.log(`   Comparación: ${isUserValid ? '✅ EXITOSA' : '❌ FALLIDA'}`);

    if (isAdminValid && isUserValid) {
      console.log("\n🎉 ¡El proceso de login debería funcionar correctamente!");
      console.log("\n📝 Posibles causas del problema:");
      console.log("   • La aplicación no está usando las credenciales correctas");
      console.log("   • Problema de conexión entre frontend y backend");
      console.log("   • Error en el manejo de errores del frontend");
      console.log("   • Problema con las sesiones de iron-session");
    }

  } catch (error) {
    console.error("❌ Error durante la simulación:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  simulateLogin();
}

export { simulateLogin };
