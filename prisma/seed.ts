import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding process...");

  // Eliminar detalles de órdenes, productos y categorías antes de crear nuevas
  await prisma.orderDetail.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

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

  // Obtener IDs de categorías
  console.log("Fetching category IDs...");
  const categoryIds = await prisma.category.findMany({
    select: { id: true },
  });
  if (categoryIds.length === 0) {
    console.error("No categories found after creation. Seeding products will fail.");
    process.exit(1);
  }
  console.log("Category IDs fetched.");

  // Crear productos de prueba asociados a las nuevas categorías
  console.log("Creating products...");
  await prisma.product.createMany({
    data: [
      // Arreglos Florales & Regalos
      {
        name: "Ramo de Rosas Rojas",
        description: "Hermoso ramo de 12 rosas rojas naturales.",
        price: 29.99,
        image: "https://example.com/images/ramo_rosas.jpg",
        categoryId: categoryIds[0].id,
        featured: true,
      },
      {
        name: "Caja de Rosas Eternas",
        description: "Caja elegante con rosas preservadas que duran años.",
        price: 59.99,
        image: "https://example.com/images/rosas_eternas.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Globo con Mensaje",
        description: "Globo personalizado con mensaje especial.",
        price: 14.99,
        image: "https://example.com/images/globo_mensaje.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Canasta de Frutas y Flores",
        description: "Canasta decorativa con frutas frescas y flores.",
        price: 44.99,
        image: "https://example.com/images/canasta_frutas_flores.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Ramo de Girasoles",
        description: "Ramo alegre de girasoles naturales.",
        price: 24.99,
        image: "https://example.com/images/ramo_girasoles.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Caja de Chocolates y Rosas",
        description: "Caja con chocolates finos y rosas frescas.",
        price: 39.99,
        image: "https://example.com/images/chocolates_rosas.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Bouquet de Flores Mixtas",
        description: "Bouquet colorido con flores variadas.",
        price: 34.99,
        image: "https://example.com/images/bouquet_mixto.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Centro de Mesa Floral",
        description: "Centro de mesa con flores frescas para eventos.",
        price: 54.99,
        image: "https://example.com/images/centro_mesa_floral.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Ramo de Tulipanes",
        description: "Ramo elegante de tulipanes de colores.",
        price: 49.99,
        image: "https://example.com/images/ramo_tulipanes.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Florero Decorativo",
        description: "Florero de cristal con flores frescas.",
        price: 27.99,
        image: "https://example.com/images/florero_decorativo.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Ramo de Lirios Blancos",
        description: "Ramo elegante de lirios blancos.",
        price: 39.99,
        image: "https://example.com/images/ramo_lirios.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Caja de Suculentas",
        description: "Caja con suculentas variadas para regalo.",
        price: 24.99,
        image: "https://example.com/images/caja_suculentas.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Ramo de Margaritas",
        description: "Ramo fresco de margaritas de colores.",
        price: 19.99,
        image: "https://example.com/images/ramo_margaritas.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Centro de Mesa con Velas",
        description: "Centro de mesa floral con velas aromáticas.",
        price: 44.99,
        image: "https://example.com/images/centro_velas.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Bouquet de Rosas Multicolor",
        description: "Bouquet de rosas de diferentes colores.",
        price: 34.99,
        image: "https://example.com/images/bouquet_rosas_multicolor.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Caja de Orquídeas",
        description: "Caja elegante con orquídeas frescas.",
        price: 59.99,
        image: "https://example.com/images/caja_orquideas.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Ramo de Peonías",
        description: "Ramo delicado de peonías rosadas.",
        price: 44.99,
        image: "https://example.com/images/ramo_peonias.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Florero con Flores Silvestres",
        description: "Florero con flores silvestres de temporada.",
        price: 29.99,
        image: "https://example.com/images/florero_silvestres.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Bouquet de Alstroemerias",
        description: "Bouquet colorido de alstroemerias.",
        price: 24.99,
        image: "https://example.com/images/bouquet_alstroemerias.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Caja de Flores Preservadas",
        description: "Caja con flores preservadas de larga duración.",
        price: 49.99,
        image: "https://example.com/images/caja_flores_preservadas.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      // Nuevos productos para llegar a 15
      {
        name: "Ramo de Claveles",
        description: "Ramo de claveles frescos y coloridos.",
        price: 22.99,
        image: "https://example.com/images/ramo_claveles.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Centro de Mesa con Rosas",
        description: "Centro de mesa elegante con rosas naturales.",
        price: 39.99,
        image: "https://example.com/images/centro_rosas.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      {
        name: "Caja de Flores Mixtas",
        description: "Caja con flores mixtas para regalo.",
        price: 29.99,
        image: "https://example.com/images/caja_flores_mixtas.jpg",
        categoryId: categoryIds[0].id,
        featured: false,
      },
      // Juguetería
      {
        name: "Oso de Peluche Gigante",
        description: "Oso de peluche suave de 1 metro de altura.",
        price: 49.99,
        image: "https://example.com/images/oso_peluche.jpg",
        categoryId: categoryIds[1].id,
        featured: false,
      },
      {
        name: "Set de Bloques de Construcción",
        description: "Bloques de colores para estimular la creatividad.",
        price: 19.99,
        image: "https://example.com/images/bloques_construccion.jpg",
        categoryId: categoryIds[1].id,
        featured: true,
      },
      {
        name: "Muñeca Interactiva",
        description: "Muñeca que habla y canta canciones.",
        price: 34.99,
        image: "https://example.com/images/muneca_interactiva.jpg",
        categoryId: categoryIds[1].id,
        featured: false,
      },
      {
        name: "Carro de Juguete a Control Remoto",
        description: "Carro deportivo con control remoto recargable.",
        price: 27.99,
        image: "https://example.com/images/carro_control_remoto.jpg",
        categoryId: categoryIds[1].id,
        featured: false,
      },
      {
        name: "Puzzle de 1000 Piezas",
        description: "Puzzle educativo de 1000 piezas para niños y adultos.",
        price: 15.99,
        image: "https://example.com/images/puzzle_1000.jpg",
        categoryId: categoryIds[1].id,
        featured: false,
      },
      {
        name: "Set de Plastilina Creativa",
        description: "Plastilina de colores para modelar y crear figuras.",
        price: 11.99,
        image: "https://example.com/images/plastilina_creativa.jpg",
        categoryId: categoryIds[1].id,
        featured: false,
      },
      {
        name: "Juego de Mesa Familiar",
        description: "Juego de mesa divertido para toda la familia.",
        price: 22.99,
        image: "https://example.com/images/juego_mesa.jpg",
        categoryId: categoryIds[1].id,
        featured: false,
      },
      {
        name: "Pelota Saltarina",
        description: "Pelota grande y resistente para saltar y jugar.",
        price: 9.99,
        image: "https://example.com/images/pelota_saltarina.jpg",
        categoryId: categoryIds[1].id,
        featured: false,
      },
      {
        name: "Set de Dinosaurios de Juguete",
        description: "Pack de dinosaurios de plástico para coleccionar.",
        price: 13.99,
        image: "https://example.com/images/dinosaurios_juguete.jpg",
        categoryId: categoryIds[1].id,
        featured: false,
      },
      // Nuevos productos para llegar a 15
      {
        name: "Camión de Bomberos de Juguete",
        description: "Camión de bomberos con escalera extensible.",
        price: 18.99,
        image: "https://example.com/images/camion_bomberos.jpg",
        categoryId: categoryIds[1].id,
        featured: false,
      },
      {
        name: "Casa de Muñecas",
        description: "Casa de muñecas de madera con accesorios.",
        price: 59.99,
        image: "https://example.com/images/casa_munecas.jpg",
        categoryId: categoryIds[1].id,
        featured: false,
      },
      {
        name: "Set de Animales de Granja",
        description: "Animales de granja de plástico para jugar.",
        price: 12.99,
        image: "https://example.com/images/animales_granja.jpg",
        categoryId: categoryIds[1].id,
        featured: false,
      },
      // Accesorios
      {
        name: "Collar de Plata 925",
        description: "Collar elegante de plata para regalo.",
        price: 39.99,
        image: "https://example.com/images/collar_plata.jpg",
        categoryId: categoryIds[2].id,
        featured: true,
      },
      {
        name: "Reloj de Pulsera Unisex",
        description: "Reloj moderno resistente al agua.",
        price: 24.99,
        image: "https://example.com/images/reloj_pulsera.jpg",
        categoryId: categoryIds[2].id,
        featured: false,
      },
      {
        name: "Gorra Estampada",
        description: "Gorra con diseño exclusivo y ajustable.",
        price: 12.99,
        image: "https://example.com/images/gorra_estampada.jpg",
        categoryId: categoryIds[2].id,
        featured: false,
      },
      {
        name: "Pulsera de Cuero",
        description: "Pulsera artesanal de cuero genuino.",
        price: 17.99,
        image: "https://example.com/images/pulsera_cuero.jpg",
        categoryId: categoryIds[2].id,
        featured: false,
      },
      {
        name: "Llavero Metálico",
        description: "Llavero resistente con diseño moderno.",
        price: 6.99,
        image: "https://example.com/images/llavero_metalico.jpg",
        categoryId: categoryIds[2].id,
        featured: false,
      },
      {
        name: "Cinturón de Tela Unisex",
        description: "Cinturón ajustable para cualquier ocasión.",
        price: 14.99,
        image: "https://example.com/images/cinturon_tela.jpg",
        categoryId: categoryIds[2].id,
        featured: false,
      },
      {
        name: "Aretes de Acero Inoxidable",
        description: "Aretes hipoalergénicos para uso diario.",
        price: 8.99,
        image: "https://example.com/images/aretes_acero.jpg",
        categoryId: categoryIds[2].id,
        featured: false,
      },
      {
        name: "Sombrero de Verano",
        description: "Sombrero ligero y fresco para el sol.",
        price: 19.99,
        image: "https://example.com/images/sombrero_verano.jpg",
        categoryId: categoryIds[2].id,
        featured: false,
      },
      {
        name: "Bufanda de Lana",
        description: "Bufanda suave y abrigadora para invierno.",
        price: 15.99,
        image: "https://example.com/images/bufanda_lana.jpg",
        categoryId: categoryIds[2].id,
        featured: false,
      },
      // Nuevos productos para llegar a 15
      {
        name: "Pulsera de Cuentas",
        description: "Pulsera hecha a mano con cuentas de colores.",
        price: 9.99,
        image: "https://example.com/images/pulsera_cuentas.jpg",
        categoryId: categoryIds[2].id,
        featured: false,
      },
      {
        name: "Anillo Ajustable",
        description: "Anillo ajustable de acero inoxidable.",
        price: 7.99,
        image: "https://example.com/images/anillo_ajustable.jpg",
        categoryId: categoryIds[2].id,
        featured: false,
      },
      {
        name: "Cartera de Cuero",
        description: "Cartera pequeña de cuero genuino.",
        price: 19.99,
        image: "https://example.com/images/cartera_cuero.jpg",
        categoryId: categoryIds[2].id,
        featured: false,
      },
      // Papelería y Miscelaneos
      {
        name: "Set de Lápices de Colores",
        description: "Set de 24 lápices de colores para dibujo.",
        price: 9.99,
        image: "https://example.com/images/lapices_colores.jpg",
        categoryId: categoryIds[3].id,
        featured: false,
      },
      {
        name: "Cuaderno de Notas A5",
        description: "Cuaderno con tapa dura y hojas rayadas.",
        price: 5.99,
        image: "https://example.com/images/cuaderno_a5.jpg",
        categoryId: categoryIds[3].id,
        featured: false,
      },
      {
        name: "Bolígrafos Gel Pack x10",
        description: "Pack de 10 bolígrafos de gel colores surtidos.",
        price: 7.99,
        image: "https://example.com/images/boligrafos_gel.jpg",
        categoryId: categoryIds[3].id,
        featured: false,
      },
      {
        name: "Regla Flexible 30cm",
        description: "Regla de plástico flexible y resistente.",
        price: 2.99,
        image: "https://example.com/images/regla_flexible.jpg",
        categoryId: categoryIds[3].id,
        featured: false,
      },
      {
        name: "Tijeras Escolares",
        description: "Tijeras seguras para niños.",
        price: 3.99,
        image: "https://example.com/images/tijeras_escolares.jpg",
        categoryId: categoryIds[3].id,
        featured: false,
      },
      {
        name: "Pegamento en Barra",
        description: "Pegamento no tóxico para manualidades.",
        price: 1.99,
        image: "https://example.com/images/pegamento_barra.jpg",
        categoryId: categoryIds[3].id,
        featured: false,
      },
      {
        name: "Marcadores de Colores x12",
        description: "Set de 12 marcadores de colores vibrantes.",
        price: 8.99,
        image: "https://example.com/images/marcadores_colores.jpg",
        categoryId: categoryIds[3].id,
        featured: false,
      },
      {
        name: "Carpeta Plástica A4",
        description: "Carpeta para organizar documentos tamaño A4.",
        price: 4.99,
        image: "https://example.com/images/carpeta_plastica.jpg",
        categoryId: categoryIds[3].id,
        featured: false,
      },
      {
        name: "Notas Adhesivas Pack x5",
        description: "Pack de 5 bloques de notas adhesivas.",
        price: 3.49,
        image: "https://example.com/images/notas_adhesivas.jpg",
        categoryId: categoryIds[3].id,
        featured: false,
      },
      // Nuevos productos para llegar a 15
      {
        name: "Estuche Escolar",
        description: "Estuche con cierre para lápices y bolígrafos.",
        price: 6.99,
        image: "https://example.com/images/estuche_escolar.jpg",
        categoryId: categoryIds[3].id,
        featured: false,
      },
      {
        name: "Compás Metálico",
        description: "Compás metálico para dibujo técnico.",
        price: 4.99,
        image: "https://example.com/images/compas_metalico.jpg",
        categoryId: categoryIds[3].id,
        featured: false,
      },
      {
        name: "Papel de Colores Pack x50",
        description: "Pack de 50 hojas de papel de colores.",
        price: 5.99,
        image: "https://example.com/images/papel_colores.jpg",
        categoryId: categoryIds[3].id,
        featured: false,
      },
      // Ropa
      {
        name: "Camisa Casual para Caballero",
        description: "Camisa de algodón, disponible en varias tallas.",
        price: 24.99,
        image: "https://example.com/images/camisa_caballero.jpg",
        categoryId: categoryIds[4].id,
        featured: true,
      },
      {
        name: "Vestido de Verano para Dama",
        description: "Vestido fresco y colorido para días soleados.",
        price: 29.99,
        image: "https://example.com/images/vestido_verano.jpg",
        categoryId: categoryIds[4].id,
        featured: false,
      },
      {
        name: "Pantalón Deportivo Unisex",
        description: "Pantalón cómodo para ejercicio o uso diario.",
        price: 19.99,
        image: "https://example.com/images/pantalon_deportivo.jpg",
        categoryId: categoryIds[4].id,
        featured: false,
      },
      {
        name: "Falda Plisada para Dama",
        description: "Falda elegante y cómoda para ocasiones especiales.",
        price: 22.99,
        image: "https://example.com/images/falda_plisada.jpg",
        categoryId: categoryIds[4].id,
        featured: false,
      },
      {
        name: "Short Deportivo Hombre",
        description: "Short ligero para entrenamiento o uso casual.",
        price: 14.99,
        image: "https://example.com/images/short_deportivo.jpg",
        categoryId: categoryIds[4].id,
        featured: false,
      },
      {
        name: "Blusa Manga Larga Mujer",
        description: "Blusa elegante para oficina o eventos.",
        price: 18.99,
        image: "https://example.com/images/blusa_manga_larga.jpg",
        categoryId: categoryIds[4].id,
        featured: false,
      },
      {
        name: "Chaqueta Impermeable Unisex",
        description: "Chaqueta ligera y resistente al agua.",
        price: 34.99,
        image: "https://example.com/images/chaqueta_impermeable.jpg",
        categoryId: categoryIds[4].id,
        featured: false,
      },
      {
        name: "Calcetines Pack x6",
        description: "Pack de 6 pares de calcetines cómodos.",
        price: 9.99,
        image: "https://example.com/images/calcetines_pack.jpg",
        categoryId: categoryIds[4].id,
        featured: false,
      },
      {
        name: "Abrigo de Lana Mujer",
        description: "Abrigo abrigador para invierno.",
        price: 49.99,
        image: "https://example.com/images/abrigo_lana.jpg",
        categoryId: categoryIds[4].id,
        featured: false,
      },
      // Nuevos productos para llegar a 15
      {
        name: "Polo Básico Hombre",
        description: "Polo de algodón en varios colores.",
        price: 15.99,
        image: "https://example.com/images/polo_basico.jpg",
        categoryId: categoryIds[4].id,
        featured: false,
      },
      {
        name: "Leggins Deportivos Mujer",
        description: "Leggins elásticos para deporte o uso diario.",
        price: 17.99,
        image: "https://example.com/images/leggins_deportivos.jpg",
        categoryId: categoryIds[4].id,
        featured: false,
      },
      {
        name: "Chaleco Acolchado Unisex",
        description: "Chaleco ligero y abrigador para el frío.",
        price: 29.99,
        image: "https://example.com/images/chaleco_acolchado.jpg",
        categoryId: categoryIds[4].id,
        featured: false,
      },
    ],
    skipDuplicates: true,
  });
  console.log("Products created.");

  // Obtener IDs de productos
  console.log("Fetching product IDs...");
  const productIds = await prisma.product.findMany({
    select: { id: true },
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

  // Crear detalles de órdenes para los nuevos productos
  console.log("Creating order details...");
  await prisma.orderDetail.createMany({
    data: [
      // Primer pedido: varios productos
      {
        order_id: orderIds[0].order_id,
        product_id: productIds[0].id,
        quantity: 2,
        unit_price: 29.99,
      },
      {
        order_id: orderIds[0].order_id,
        product_id: productIds[1].id,
        quantity: 1,
        unit_price: 59.99,
      },
      {
        order_id: orderIds[0].order_id,
        product_id: productIds[3].id,
        quantity: 1,
        unit_price: 49.99,
      },
      // Segundo pedido: otros productos
      {
        order_id: orderIds[1].order_id,
        product_id: productIds[4].id,
        quantity: 3,
        unit_price: 19.99,
      },
      {
        order_id: orderIds[1].order_id,
        product_id: productIds[7].id,
        quantity: 2,
        unit_price: 39.99,
      },
      {
        order_id: orderIds[1].order_id,
        product_id: productIds[10].id,
        quantity: 1,
        unit_price: 7.99,
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