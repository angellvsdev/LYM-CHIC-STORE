import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function directUserCreation() {
  console.log("⚡ CREACIÓN DIRECTA DE USUARIOS - SOLUCIÓN ALTERNATIVA");
  console.log("====================================================\n");

  try {
    // Paso 1: Limpiar completamente
    console.log("1️⃣ Limpiando usuarios existentes...");
    await prisma.user.deleteMany({
      where: {
        email_address: {
          in: ["admin@test.com", "user@test.com"]
        }
      }
    });
    console.log("✅ Limpieza completada\n");

    // Paso 2: Crear contraseñas hasheadas
    console.log("2️⃣ Creando contraseñas hasheadas...");
    const passwords = {
      admin: "admin123456",
      user: "user123456"
    };

    const hashedPasswords = {
      admin: await bcrypt.hash(passwords.admin, 12), // Más rondas de hashing
      user: await bcrypt.hash(passwords.user, 12)
    };

    console.log(`   Admin: ${passwords.admin} → ${hashedPasswords.admin.substring(0, 20)}...`);
    console.log(`   User: ${passwords.user} → ${hashedPasswords.user.substring(0, 20)}...\n`);

    // Paso 3: Crear usuarios con datos mínimos pero correctos
    console.log("3️⃣ Creando usuarios...");

    const admin = await prisma.user.create({
      data: {
        name: "Admin Test",
        email_address: "admin@test.com",
        password: hashedPasswords.admin,
        phone_number: "123456789",
        registration_date: new Date(),
        role: "admin"
      }
    });

    const user = await prisma.user.create({
      data: {
        name: "User Test",
        email_address: "user@test.com",
        password: hashedPasswords.user,
        phone_number: "987654321",
        registration_date: new Date(),
        role: "user"
      }
    });

    console.log("✅ Usuarios creados exitosamente");
    console.log(`   Admin ID: ${admin.user_id}`);
    console.log(`   User ID: ${user.user_id}\n`);

    // Paso 4: Verificar inmediatamente
    console.log("4️⃣ Verificando usuarios en la base de datos...");

    const verifyAdmin = await prisma.user.findUnique({
      where: { user_id: admin.user_id },
      select: { user_id: true, email_address: true, role: true, password: true }
    });

    const verifyUser = await prisma.user.findUnique({
      where: { user_id: user.user_id },
      select: { user_id: true, email_address: true, role: true, password: true }
    });

    console.log(`   Admin encontrado: ${verifyAdmin ? '✅' : '❌'}`);
    console.log(`   User encontrado: ${verifyUser ? '✅' : '❌'}\n`);

    // Paso 5: Test de comparación de contraseñas
    console.log("5️⃣ Test final de comparación de contraseñas...");

    const adminCompare = await bcrypt.compare(passwords.admin, verifyAdmin!.password);
    const userCompare = await bcrypt.compare(passwords.user, verifyUser!.password);

    console.log(`   Admin password match: ${adminCompare ? '✅' : '❌'}`);
    console.log(`   User password match: ${userCompare ? '✅' : '❌'}\n`);

    if (adminCompare && userCompare) {
      console.log("🎉 ¡USUARIOS CREADOS Y VALIDADOS EXITOSAMENTE!");
      console.log("\n📋 CREDENCIALES DEFINITIVAS:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("👑 ADMINISTRADOR:");
      console.log(`   Email: admin@test.com`);
      console.log(`   Contraseña: admin123456`);
      console.log("");
      console.log("👤 USUARIO REGULAR:");
      console.log(`   Email: user@test.com`);
      console.log(`   Contraseña: user123456`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("\n💡 Estos usuarios DEBEN funcionar en la aplicación");
      console.log("   Si aún recibes 'invalid credentials', el problema está en:");
      console.log("   • El endpoint de login (/api/auth/login)");
      console.log("   • La configuración de sesiones (iron-session)");
      console.log("   • La conexión de red entre frontend y backend");
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  directUserCreation();
}

export { directUserCreation };
