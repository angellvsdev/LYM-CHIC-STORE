import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Crear estados de órdenes
  const orderStatuses = await prisma.orderStatus.createMany({
    data: [
      { status_name: "Pendiente" },
      { status_name: "En Proceso" },
      { status_name: "Enviado" },
      { status_name: "Entregado" },
      { status_name: "Cancelado" },
    ],
    skipDuplicates: true,
  });

  // Crear categorías
  const categories = await prisma.category.createMany({
    data: [
      {
        category_name: "Ropa",
        category_description: "Ropa para todas las edades y estilos",
      },
      {
        category_name: "Calzado",
        category_description: "Zapatos y calzado deportivo",
      },
      {
        category_name: "Accesorios",
        category_description: "Bolsos, joyería y complementos",
      },
      {
        category_name: "Hogar",
        category_description: "Artículos para el hogar",
      },
    ],
    skipDuplicates: true,
  });

  // Obtener IDs de categorías
  const categoryIds = await prisma.category.findMany({
    select: { category_id: true },
  });

  // Crear productos
  const products = await prisma.product.createMany({
    data: [
      {
        name: "Camiseta Básica",
        description: "Camiseta de algodón 100%",
        price: 19.99,
        category_id: categoryIds[0].category_id,
      },
      {
        name: "Jeans Clásicos",
        description: "Jeans ajustados de mezclilla",
        price: 49.99,
        category_id: categoryIds[0].category_id,
      },
      {
        name: "Zapatillas Deportivas",
        description: "Zapatillas para running",
        price: 79.99,
        category_id: categoryIds[1].category_id,
      },
      {
        name: "Bolso de Mano",
        description: "Bolso elegante para el día a día",
        price: 39.99,
        category_id: categoryIds[2].category_id,
      },
      {
        name: "Juego de Sábanas",
        description: "Juego de sábanas de algodón",
        price: 29.99,
        category_id: categoryIds[3].category_id,
      },
      {
        name: "Vestido de Verano",
        description: "Vestido ligero para el verano",
        price: 59.99,
        category_id: categoryIds[0].category_id,
      },
      {
        name: "Botas de Invierno",
        description: "Botas impermeables para invierno",
        price: 89.99,
        category_id: categoryIds[1].category_id,
      },
      {
        name: "Collar de Plata",
        description: "Collar elegante de plata 925",
        price: 45.99,
        category_id: categoryIds[2].category_id,
      },
      {
        name: "Cojines Decorativos",
        description: "Set de 4 cojines para el sofá",
        price: 34.99,
        category_id: categoryIds[3].category_id,
      },
      {
        name: "Chaqueta de Cuero",
        description: "Chaqueta de cuero genuino",
        price: 199.99,
        category_id: categoryIds[0].category_id,
      },
    ],
    skipDuplicates: true,
  });

  // Obtener IDs de productos
  const productIds = await prisma.product.findMany({
    select: { product_id: true },
  });

  // Encriptar contraseñas
  const saltRounds = 10;
  const adminPassword = await bcrypt.hash("admin123", saltRounds);
  const userPassword = await bcrypt.hash("user123", saltRounds);

  // Crear usuarios con contraseñas encriptadas
  const users = await prisma.user.createMany({
    data: [
      {
        name: "Admin User",
        phone_number: "+1234567890",
        email_address: "admin@example.com",
        password: adminPassword,
        registration_date: new Date(),
        role: "admin",
      },
      {
        name: "Regular User",
        phone_number: "+0987654321",
        email_address: "user@example.com",
        password: userPassword,
        registration_date: new Date(),
        role: "user",
      },
    ],
    skipDuplicates: true,
  });

  // Obtener IDs de usuarios y estados
  const [userIds, statusIds] = await Promise.all([
    prisma.user.findMany({ select: { user_id: true } }),
    prisma.orderStatus.findMany({ select: { order_status_id: true } }),
  ]);

  // Crear órdenes
  const orders = await prisma.order.createMany({
    data: [
      {
        order_number: "ORD-001",
        user_id: userIds[1].user_id,
        order_date: new Date(),
        order_status_id: statusIds[0].order_status_id,
        delivery_method: "Estándar",
      },
      {
        order_number: "ORD-002",
        user_id: userIds[1].user_id,
        order_date: new Date(),
        order_status_id: statusIds[1].order_status_id,
        delivery_method: "Express",
      },
    ],
    skipDuplicates: true,
  });

  // Obtener IDs de órdenes
  const orderIds = await prisma.order.findMany({
    select: { order_id: true },
  });

  // Crear detalles de órdenes
  const orderDetails = await prisma.orderDetail.createMany({
    data: [
      {
        order_id: orderIds[0].order_id,
        product_id: productIds[0].product_id,
        quantity: 2,
        unit_price: 19.99,
      },
      {
        order_id: orderIds[0].order_id,
        product_id: productIds[2].product_id,
        quantity: 1,
        unit_price: 79.99,
      },
      {
        order_id: orderIds[1].order_id,
        product_id: productIds[4].product_id,
        quantity: 3,
        unit_price: 29.99,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
