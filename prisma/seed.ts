import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding process...");

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

  // Crear categorías
  console.log("Creating categories...");
  await prisma.category.createMany({
    data: [
      {
        name: "Ropa", // Corrected: category_name -> name
        description: "Ropa para todas las edades y estilos", // Corrected: category_description -> description
        image: "https://example.com/images/ropa.jpg", // Added: required 'image' field
        featured: true, // Added: required 'featured' field
      },
      {
        name: "Calzado", // Corrected: category_name -> name
        description: "Zapatos y calzado deportivo", // Corrected: category_description -> description
        image: "https://example.com/images/calzado.jpg", // Added: required 'image' field
        featured: false, // Added: required 'featured' field
      },
      {
        name: "Accesorios", // Corrected: category_name -> name
        description: "Bolsos, joyería y complementos", // Corrected: category_description -> description
        image: "https://example.com/images/accesorios.jpg", // Added: required 'image' field
        featured: true, // Added: required 'featured' field
      },
      {
        name: "Hogar", // Corrected: category_name -> name
        description: "Artículos para el hogar", // Corrected: category_description -> description
        image: "https://example.com/images/hogar.jpg", // Added: required 'image' field
        featured: false, // Added: required 'featured' field
      },
    ],
    skipDuplicates: true,
  });
  console.log("Categories created.");

  // Obtener IDs de categorías
  console.log("Fetching category IDs...");
  const categoryIds = await prisma.category.findMany({
    select: { id: true }, // Corrected: category_id -> id
  });
  if (categoryIds.length === 0) {
    console.error("No categories found after creation. Seeding products will fail.");
    process.exit(1);
  }
  console.log("Category IDs fetched.");

  // Crear productos
  console.log("Creating products...");
  await prisma.product.createMany({
    data: [
      {
        name: "Camiseta Básica",
        description: "Camiseta de algodón 100%",
        price: 19.99,
        image: "https://example.com/images/camiseta.jpg", // Added: required 'image' field
        categoryId: categoryIds[0].id, // Corrected: category_id -> categoryId, and category_id -> id
        featured: true, // Optional: setting a value for featured
      },
      {
        name: "Jeans Clásicos",
        description: "Jeans ajustados de mezclilla",
        price: 49.99,
        image: "https://example.com/images/jeans.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Zapatillas Deportivas",
        description: "Zapatillas para running",
        price: 79.99,
        image: "https://example.com/images/zapatillas.jpg",
        categoryId: categoryIds[1].id,
        featured: true,
      },
      {
        name: "Bolso de Mano",
        description: "Bolso elegante para el día a día",
        price: 39.99,
        image: "https://example.com/images/bolso.jpg",
        categoryId: categoryIds[2].id,
        featured: false,
      },
      {
        name: "Juego de Sábanas",
        description: "Juego de sábanas de algodón",
        price: 29.99,
        image: "https://example.com/images/sabanas.jpg",
        categoryId: categoryIds[3].id,
        featured: true,
      },
      {
        name: "Vestido de Verano",
        description: "Vestido ligero para el verano",
        price: 59.99,
        image: "https://example.com/images/vestido.jpg",
        categoryId: categoryIds[0].id,
      },
      {
        name: "Botas de Invierno",
        description: "Botas impermeables para invierno",
        price: 89.99,
        image: "https://example.com/images/botas.jpg",
        categoryId: categoryIds[1].id,
      },
      {
        name: "Collar de Plata",
        description: "Collar elegante de plata 925",
        price: 45.99,
        image: "https://example.com/images/collar.jpg",
        categoryId: categoryIds[2].id,
      },
      {
        name: "Cojines Decorativos",
        description: "Set de 4 cojines para el sofá",
        price: 34.99,
        image: "https://example.com/images/cojines.jpg",
        categoryId: categoryIds[3].id,
      },
      {
        name: "Chaqueta de Cuero",
        description: "Chaqueta de cuero genuino",
        price: 199.99,
        image: "https://example.com/images/chaqueta.jpg",
        categoryId: categoryIds[0].id,
      },
    ],
    skipDuplicates: true,
  });
  console.log("Products created.");

  // Obtener IDs de productos
  console.log("Fetching product IDs...");
  const productIds = await prisma.product.findMany({
    select: { id: true }, // Corrected: product_id -> id
  });
  if (productIds.length === 0) {
    console.error("No products found after creation. Seeding order details will fail.");
    process.exit(1);
  }
  console.log("Product IDs fetched.");

  // Encriptar contraseñas
  console.log("Hashing passwords...");
  const saltRounds = 10;
  const adminPassword = await bcrypt.hash("admin123", saltRounds);
  const userPassword = await bcrypt.hash("user123", saltRounds);
  console.log("Passwords hashed.");

  // Crear usuarios con contraseñas encriptadas
  console.log("Creating users...");
  await prisma.user.createMany({
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
  console.log("Users created.");

  // Obtener IDs de usuarios y estados
  console.log("Fetching user and order status IDs...");
  const [userIds, statusIds] = await Promise.all([
    prisma.user.findMany({ select: { user_id: true } }),
    prisma.orderStatus.findMany({ select: { order_status_id: true } }),
  ]);
  if (userIds.length === 0 || statusIds.length === 0) {
    console.error("Missing user or order status IDs. Seeding orders will fail.");
    process.exit(1);
  }
  console.log("User and order status IDs fetched.");


  // Crear órdenes
  console.log("Creating orders...");
  await prisma.order.createMany({
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
  console.log("Orders created.");

  // Obtener IDs de órdenes
  console.log("Fetching order IDs...");
  const orderIds = await prisma.order.findMany({
    select: { order_id: true },
  });
  if (orderIds.length === 0) {
    console.error("No orders found after creation. Seeding order details will fail.");
    process.exit(1);
  }
  console.log("Order IDs fetched.");

  // Crear detalles de órdenes
  console.log("Creating order details...");
  await prisma.orderDetail.createMany({
    data: [
      {
        order_id: orderIds[0].order_id,
        product_id: productIds[0].id, // Corrected: product_id -> id
        quantity: 2,
        unit_price: 19.99,
      },
      {
        order_id: orderIds[0].order_id,
        product_id: productIds[2].id, // Corrected: product_id -> id
        quantity: 1,
        unit_price: 79.99,
      },
      {
        order_id: orderIds[1].order_id,
        product_id: productIds[4].id, // Corrected: product_id -> id
        quantity: 3,
        unit_price: 29.99,
      },
    ],
    skipDuplicates: true,
  });
  console.log("Order details created.");

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error("An error occurred during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Prisma client disconnected.");
  });