import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createFreshAdmin() {
  console.log("🔄 Creando administrador fresco con rol correcto...");

  try {
    // Limpiar usuario existente
    await prisma.user.deleteMany({
      where: { email_address: "admin@test.com" }
    });

    // Crear nuevo administrador con rol correcto
    const hashedPassword = await bcrypt.hash("admin123456", 12);

    const admin = await prisma.user.create({
      data: {
        name: "Administrador Fresco",
        email_address: "admin@test.com",
        password: hashedPassword,
        phone_number: "+1234567890",
        registration_date: new Date(),
        role: "admin", // Asegurar que el rol sea exactamente "admin"
        age: 30,
        gender: "masculino",
      },
    });

    console.log("✅ Administrador creado con rol:", admin.role);
    console.log("✅ Credenciales:");
    console.log("   Email: admin@test.com");
    console.log("   Contraseña: admin123456");
    console.log("   Rol: admin");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createFreshAdmin();
}

export { createFreshAdmin };
