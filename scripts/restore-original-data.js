#!/usr/bin/env node

/**
 * Script para restaurar tus datos originales
 * Basado en tu seed.ts original con categorías y productos reales
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function restoreOriginalData() {
  try {
    console.log('🔄 Restaurando datos originales de LYM ChicStore...\n');

    // 1. Limpiar datos existentes
    console.log('📋 Limpiando datos existentes...');
    await prisma.orderDetail.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.orderStatus.deleteMany({});
    await prisma.user.deleteMany({});

    // 2. Crear estados de órdenes (TUS ORIGINALES)
    console.log('📋 Creando estados de pedido originales...');
    await prisma.orderStatus.createMany({
      data: [
        { status_name: "Pendiente" },
        { status_name: "En Proceso" },
        { status_name: "Enviado" },
        { status_name: "Entregado" },
        { status_name: "Cancelado" },
      ],
    });
    console.log('✅ Estados de pedido creados');

    // 3. Crear categorías (TUS ORIGINALES)
    console.log('📋 Creando categorías originales...');
    const categories = await prisma.category.createMany({
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
    });
    console.log(`✅ ${categories.count} categorías creadas`);

    // 4. Obtener IDs de categorías
    const categoryIds = await prisma.category.findMany({
      select: { id: true, name: true },
    });

    const categoryMap = {};
    categoryIds.forEach(cat => {
      if (cat.name.includes("Arreglos")) categoryMap.flowers = cat.id;
      else if (cat.name.includes("Juguetería")) categoryMap.toys = cat.id;
      else if (cat.name.includes("Accesorios")) categoryMap.accessories = cat.id;
      else if (cat.name.includes("Papelería")) categoryMap.stationery = cat.id;
      else if (cat.name.includes("Ropa")) categoryMap.clothing = cat.id;
    });

    // 5. Crear productos (TUS ORIGINALES)
    console.log('📋 Creando productos originales...');
    const products = [
      // Arreglos Florales & Regalos
      {
        name: "Ramo de Rosas Rojas",
        description: "Hermoso ramo de 12 rosas rojas naturales.",
        price: 29.99,
        image: "https://example.com/images/ramo_rosas.jpg",
        categoryId: categoryMap.flowers,
        featured: true,
        stock: 15,
      },
      {
        name: "Caja de Rosas Eternas",
        description: "Caja elegante con rosas preservadas que durarán años.",
        price: 59.99,
        image: "https://example.com/images/rosas_eternas.jpg",
        categoryId: categoryMap.flowers,
        featured: false,
        stock: 8,
      },
      {
        name: "Globo con Mensaje",
        description: "Globo personalizado con mensaje especial.",
        price: 14.99,
        image: "https://example.com/images/globo_mensaje.jpg",
        categoryId: categoryMap.flowers,
        featured: false,
        stock: 20,
      },
      {
        name: "Canasta de Frutas y Flores",
        description: "Canasta decorativa con frutas frescas y flores.",
        price: 44.99,
        image: "https://example.com/images/canasta_frutas_flores.jpg",
        categoryId: categoryMap.flowers,
        featured: false,
        stock: 10,
      },
      {
        name: "Ramo de Girasoles",
        description: "Ramo alegre de girasoles naturales.",
        price: 24.99,
        image: "https://example.com/images/ramo_girasoles.jpg",
        categoryId: categoryMap.flowers,
        featured: false,
        stock: 12,
      },
      {
        name: "Caja de Chocolates y Rosas",
        description: "Caja con chocolates finos y rosas frescas.",
        price: 39.99,
        image: "https://example.com/images/chocolates_rosas.jpg",
        categoryId: categoryMap.flowers,
        featured: false,
        stock: 15,
      },
      {
        name: "Bouquet de Flores Mixtas",
        description: "Bouquet colorido con flores variadas.",
        price: 34.99,
        image: "https://example.com/images/bouquet_mixto.jpg",
        categoryId: categoryMap.flowers,
        featured: false,
        stock: 18,
      },
      {
        name: "Centro de Mesa Floral",
        description: "Centro de mesa con flores frescas para eventos.",
        price: 54.99,
        image: "https://example.com/images/centro_mesa_floral.jpg",
        categoryId: categoryMap.flowers,
        featured: false,
        stock: 6,
      },
      {
        name: "Ramo de Tulipanes",
        description: "Ramo elegante de tulipanes de colores.",
        price: 49.99,
        image: "https://example.com/images/ramo_tulipanes.jpg",
        categoryId: categoryMap.flowers,
        featured: false,
        stock: 10,
      },
      {
        name: "Arreglo de Orquídeas",
        description: "Exótico arreglo de orquídeas blancas.",
        price: 69.99,
        image: "https://example.com/images/arreglo_orquideas.jpg",
        categoryId: categoryMap.flowers,
        featured: true,
        stock: 5,
      },
      // Juguetería
      {
        name: "Set de Bloques Constructores",
        description: "Bloques de construcción para desarrollar creatividad.",
        price: 35.99,
        image: "https://example.com/images/bloques.jpg",
        categoryId: categoryMap.toys,
        featured: false,
        stock: 25,
      },
      {
        name: "Muñeca de Tela",
        description: "Muñeca suave y lavable para niños.",
        price: 22.99,
        image: "https://example.com/images/muneca.jpg",
        categoryId: categoryMap.toys,
        featured: false,
        stock: 30,
      },
      {
        name: "Carro de Control Remoto",
        description: "Carro deportivo con control remoto.",
        price: 45.99,
        image: "https://example.com/images/carro_remoto.jpg",
        categoryId: categoryMap.toys,
        featured: true,
        stock: 12,
      },
      // Accesorios
      {
        name: "Bolso de Mano Elegante",
        description: "Bolso de cuero genuino con múltiples compartimentos.",
        price: 89.99,
        image: "https://example.com/images/bolso.jpg",
        categoryId: categoryMap.accessories,
        featured: true,
        stock: 8,
      },
      {
        name: "Reloj de Pulsera",
        description: "Reloj analógico elegante para damas.",
        price: 65.99,
        image: "https://example.com/images/reloj.jpg",
        categoryId: categoryMap.accessories,
        featured: false,
        stock: 15,
      },
      // Papelería
      {
        name: "Set de Lápices de Colores",
        description: "Set de 24 lápices de colores profesionales.",
        price: 12.99,
        image: "https://example.com/images/lapices.jpg",
        categoryId: categoryMap.stationery,
        featured: false,
        stock: 50,
      },
      {
        name: "Cuaderno de Notas",
        description: "Cuaderno espiral con 200 hojas.",
        price: 8.99,
        image: "https://example.com/images/cuaderno.jpg",
        categoryId: categoryMap.stationery,
        featured: false,
        stock: 100,
      },
      // Ropa
      {
        name: "Camisa Casual Algodón",
        description: "Camisa de algodón 100% para uso diario.",
        price: 32.99,
        image: "https://example.com/images/camisa.jpg",
        categoryId: categoryMap.clothing,
        featured: false,
        stock: 40,
      },
      {
        name: "Jeans Clásicos",
        description: "Jeans de mezclilla cómodos y duraderos.",
        price: 55.99,
        image: "https://example.com/images/jeans.jpg",
        categoryId: categoryMap.clothing,
        featured: true,
        stock: 25,
      },
    ];

    await prisma.product.createMany({ data: products });
    console.log(`✅ ${products.length} productos creados`);

    // 6. Crear usuarios
    console.log('📋 Creando usuarios...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await prisma.user.createMany({
      data: [
        {
          name: "Administrador LYM",
          email_address: "admin@test",
          password: adminPassword,
          phone_number: "1234567890",
          registration_date: new Date(),
          role: "admin",
          age: 30,
          gender: "other"
        },
        {
          name: "Usuario Prueba",
          email_address: "user@test",
          password: userPassword,
          phone_number: "0987654321",
          registration_date: new Date(),
          role: "user",
          age: 25,
          gender: "other"
        }
      ]
    });
    console.log('✅ Usuarios creados');

    console.log('\n🎉 ¡Datos originales restaurados exitosamente!');
    console.log('\n📊 Resumen de datos restaurados:');
    console.log(`   🌸 Categorías: ${categoryIds.length} (tus categorías originales)`);
    console.log(`   🛍️  Productos: ${products.length} (tus productos reales)`);
    console.log(`   📦 Estados: 5 (Pendiente, En Proceso, Enviado, Entregado, Cancelado)`);
    console.log(`   👤 Usuarios: 2 (admin + user)`);
    
    console.log('\n🔑 Credenciales:');
    console.log('   Admin: admin@test / admin123');
    console.log('   User:  user@test / user123');

  } catch (error) {
    console.error('❌ Error restaurando datos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

restoreOriginalData();
