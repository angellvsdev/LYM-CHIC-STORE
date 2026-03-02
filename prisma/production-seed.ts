import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting production seeding process...");

    // Eliminar todos los datos existentes para tener una base de datos limpia en producción
    console.log("Cleaning up existing data...");
    await prisma.orderDetail.deleteMany({});
    await prisma.orderStatusHistory.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.orderStatus.deleteMany({});

    // Crear estados de órdenes
    console.log("Creating order statuses...");
    await prisma.orderStatus.createMany({
        data: [
            { status_name: "Pendiente" },
            { status_name: "En Proceso" },
            { status_name: "Enviado" },
            { status_name: "Entregado" },
            { status_name: "Cancelado" },
        ],
        skipDuplicates: true,
    });
    console.log("Order statuses created.");

    // Crear categorías base
    console.log("Creating categories...");
    await prisma.category.createMany({
        data: [
            {
                name: "Arreglos Florales & Regalos",
                description: "Arreglos florales y rosas eternas.",
                image: "https://example.com/images/ropa.jpg",
                featured: true,
            },
            {
                name: "Juguetería",
                description: "Entretenimiento y diversión para los más pequeños.",
                image: "https://example.com/images/calzado.jpg",
                featured: false,
            },
            {
                name: "Accesorios",
                description: "Bolsos, joyería y complementos para damas y caballeros.",
                image: "https://example.com/images/accesorios.jpg",
                featured: true,
            },
            {
                name: "Papelería y Miscelaneos",
                description: "Artículos escolares y variedad.",
                image: "https://example.com/images/hogar.jpg",
                featured: false,
            },
            {
                name: "Ropa",
                description: "Moda para damas y caballeros.",
                image: "https://example.com/images/hogar.jpg",
                featured: false,
            },
        ],
        skipDuplicates: true,
    });
    console.log("Categories created.");

    // Encriptar contraseña del administrador
    console.log("Hashing admin password...");
    const saltRounds = 10;
    const adminPassword = await bcrypt.hash("Lym_administration_321", saltRounds);

    // Crear único usuario administrador definido
    console.log("Creating admin user...");
    await prisma.user.create({
        data: {
            name: "Admin LYM",
            phone_number: "+0000000000",
            email_address: "lymchicstore@gmail.com",
            password: adminPassword,
            registration_date: new Date(),
            role: "admin",
        },
    });
    console.log("Admin user created successfully.");

    console.log("✨ Production seeding process completed successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Error during production seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
