import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function diagnoseUsers() {
  console.log("🔍 Diagnóstico de usuarios de prueba...\n");

  try {
    // Buscar usuarios existentes
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email_address: "admin@test.com" },
          { email_address: "user@test.com" }
        ]
      },
      select: {
        user_id: true,
        name: true,
        email_address: true,
        password: true,
        role: true,
        registration_date: true
      }
    });

    console.log(`📊 Usuarios encontrados: ${users.length}\n`);

    if (users.length === 0) {
      console.log("❌ No se encontraron usuarios de prueba en la base de datos");
      console.log("💡 Ejecuta: npm run db:reset-test-users");
      return;
    }

    // Verificar cada usuario
    for (const user of users) {
      console.log(`👤 Usuario: ${user.name}`);
      console.log(`   Email: ${user.email_address}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   ID: ${user.user_id}`);
      console.log(`   Tiene contraseña: ${user.password ? '✅ Sí' : '❌ No'}`);

      // Probar las contraseñas conocidas
      const passwordsToTest = [
        { password: "admin123456", description: "Contraseña actual" },
        { password: "admin123", description: "Contraseña antigua" },
        { password: "user123456", description: "Contraseña usuario actual" },
        { password: "user123", description: "Contraseña usuario antigua" }
      ];

      console.log(`   🔐 Probando contraseñas:`);

      for (const { password, description } of passwordsToTest) {
        if (user.email_address === "admin@test.com" && (password === "admin123456" || password === "admin123")) {
          const isValid = await bcrypt.compare(password, user.password);
          console.log(`      ${description}: ${password} → ${isValid ? '✅ Válida' : '❌ Inválida'}`);
        } else if (user.email_address === "user@test.com" && (password === "user123456" || password === "user123")) {
          const isValid = await bcrypt.compare(password, user.password);
          console.log(`      ${description}: ${password} → ${isValid ? '✅ Válida' : '❌ Inválida'}`);
        }
      }

      console.log("");
    }

    // Crear usuarios si no existen o están mal
    const adminExists = users.some(u => u.email_address === "admin@test.com");
    const userExists = users.some(u => u.email_address === "user@test.com");

    if (!adminExists) {
      console.log("🔧 Creando administrador de prueba...");
      const hashedPassword = await bcrypt.hash("admin123456", 10);
      await prisma.user.create({
        data: {
          name: "Administrador Prueba",
          phone_number: "+1234567890",
          email_address: "admin@test.com",
          password: hashedPassword,
          registration_date: new Date(),
          role: "admin",
          age: 30,
          gender: "masculino",
        },
      });
      console.log("✅ Administrador creado");
    }

    if (!userExists) {
      console.log("🔧 Creando usuario de prueba...");
      const hashedPassword = await bcrypt.hash("user123456", 10);
      await prisma.user.create({
        data: {
          name: "Usuario Prueba",
          phone_number: "+0987654321",
          email_address: "user@test.com",
          password: hashedPassword,
          registration_date: new Date(),
          role: "user",
          age: 25,
          gender: "femenino",
        },
      });
      console.log("✅ Usuario creado");
    }

    console.log("\n🎯 Resumen:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Usa estas credenciales para login:");
    console.log("   👑 Admin: admin@test.com / admin123456");
    console.log("   👤 User: user@test.com / user123456");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  } catch (error) {
    console.error("❌ Error durante el diagnóstico:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  diagnoseUsers();
}

export { diagnoseUsers };
