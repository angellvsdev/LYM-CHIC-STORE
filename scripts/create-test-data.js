#!/usr/bin/env node

/**
 * Script simple para crear datos de prueba
 * Evita problemas de configuración TypeScript
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestData() {
  try {
    console.log('🚀 Creando datos de prueba para LYM ChicStore...\n');

    // 1. Crear usuario admin
    console.log('📋 Creando usuario admin...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.upsert({
      where: { email_address: 'admin@test' },
      update: {},
      create: {
        name: 'Administrador',
        email_address: 'admin@test',
        password: hashedPassword,
        phone_number: '1234567890',
        registration_date: new Date(),
        role: 'admin',
        age: 30,
        gender: 'other'
      }
    });
    
    console.log('✅ Admin creado: admin@test / admin123');

    // 2. Crear categorías
    console.log('\n📋 Creando categorías...');
    
    const categories = [
      {
        id: 'cat-1',
        name: 'Ropa Mujer',
        description: 'Colección exclusiva de moda femenina',
        image: 'https://res.cloudinary.com/demo/image/upload/v1/categories/women',
        featured: true
      },
      {
        id: 'cat-2', 
        name: 'Ropa Hombre',
        description: 'Estilo y comodidad para el hombre moderno',
        image: 'https://res.cloudinary.com/demo/image/upload/v1/categories/men',
        featured: true
      },
      {
        id: 'cat-3',
        name: 'Accesorios',
        description: 'Complementos perfectos para tu look',
        image: 'https://res.cloudinary.com/demo/image/upload/v1/categories/accessories',
        featured: false
      },
      {
        id: 'cat-4',
        name: 'Calzado',
        description: 'Zapatos cómodos y elegantes',
        image: 'https://res.cloudinary.com/demo/image/upload/v1/categories/shoes',
        featured: true
      }
    ];

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { id: cat.id },
        update: {},
        create: cat
      });
    }
    
    console.log(`✅ ${categories.length} categorías creadas`);

    // 3. Crear productos
    console.log('\n📋 Creando productos...');
    
    const products = [
      {
        id: 'prod-1',
        name: 'Vestido Elegante',
        price: 89.99,
        description: 'Vestido perfecto para ocasiones especiales',
        image: 'https://res.cloudinary.com/demo/image/upload/v1/products/dress1',
        images: ['https://res.cloudinary.com/demo/image/upload/v1/products/dress1'],
        size: 'M',
        color: 'Negro',
        featured: true,
        stock: 15,
        categoryId: 'cat-1'
      },
      {
        id: 'prod-2',
        name: 'Camisa Casual',
        price: 45.99,
        description: 'Camisa cómoda para el día a día',
        image: 'https://res.cloudinary.com/demo/image/upload/v1/products/shirt1',
        images: ['https://res.cloudinary.com/demo/image/upload/v1/products/shirt1'],
        size: 'L',
        color: 'Azul',
        featured: true,
        stock: 25,
        categoryId: 'cat-2'
      },
      {
        id: 'prod-3',
        name: 'Bolso de Mano',
        price: 65.99,
        description: 'Bolso elegante y espacioso',
        image: 'https://res.cloudinary.com/demo/image/upload/v1/products/bag1',
        images: ['https://res.cloudinary.com/demo/image/upload/v1/products/bag1'],
        size: 'Universal',
        color: 'Marrón',
        featured: false,
        stock: 10,
        categoryId: 'cat-3'
      },
      {
        id: 'prod-4',
        name: 'Zapatillas Deportivas',
        price: 120.99,
        description: 'Zapatillas cómodas para ejercicio',
        image: 'https://res.cloudinary.com/demo/image/upload/v1/products/shoes1',
        images: ['https://res.cloudinary.com/demo/image/upload/v1/products/shoes1'],
        size: '42',
        color: 'Blanco',
        featured: true,
        stock: 20,
        categoryId: 'cat-4'
      },
      {
        id: 'prod-5',
        name: 'Jeans Clásicos',
        price: 75.99,
        description: 'Jeans de alta calidad',
        image: 'https://res.cloudinary.com/demo/image/upload/v1/products/jeans1',
        images: ['https://res.cloudinary.com/demo/image/upload/v1/products/jeans1'],
        size: '32',
        color: 'Azul Marino',
        featured: true,
        stock: 18,
        categoryId: 'cat-2'
      },
      {
        id: 'prod-6',
        name: 'Blusa Veraniega',
        price: 55.99,
        description: 'Blusa ligera y fresca',
        image: 'https://res.cloudinary.com/demo/image/upload/v1/products/blouse1',
        images: ['https://res.cloudinary.com/demo/image/upload/v1/products/blouse1'],
        size: 'S',
        color: 'Blanco',
        featured: false,
        stock: 12,
        categoryId: 'cat-1'
      },
      {
        id: 'prod-7',
        name: 'Reloj Elegante',
        price: 150.99,
        description: 'Reloj de precisión y estilo',
        image: 'https://res.cloudinary.com/demo/image/upload/v1/products/watch1',
        images: ['https://res.cloudinary.com/demo/image/upload/v1/products/watch1'],
        size: 'Universal',
        color: 'Plateado',
        featured: true,
        stock: 8,
        categoryId: 'cat-3'
      },
      {
        id: 'prod-8',
        name: 'Tenis Correr',
        price: 95.99,
        description: 'Tenis profesionales para correr',
        image: 'https://res.cloudinary.com/demo/image/upload/v1/products/running1',
        images: ['https://res.cloudinary.com/demo/image/upload/v1/products/running1'],
        size: '43',
        color: 'Negro',
        featured: false,
        stock: 15,
        categoryId: 'cat-4'
      }
    ];

    for (const prod of products) {
      await prisma.product.upsert({
        where: { id: prod.id },
        update: {},
        create: prod
      });
    }
    
    console.log(`✅ ${products.length} productos creados`);

    // 4. Crear estados de pedido
    console.log('\n📋 Creando estados de pedido...');
    
    const orderStatuses = [
      { order_status_id: 1, status_name: 'pendiente' },
      { order_status_id: 2, status_name: 'en proceso' },
      { order_status_id: 3, status_name: 'enviado' },
      { order_status_id: 4, status_name: 'entregado' },
      { order_status_id: 5, status_name: 'cancelado' }
    ];

    for (const status of orderStatuses) {
      await prisma.orderStatus.upsert({
        where: { order_status_id: status.order_status_id },
        update: {},
        create: status
      });
    }
    
    console.log(`✅ ${orderStatuses.length} estados de pedido creados`);

    // 5. Crear usuario normal de prueba
    console.log('\n📋 Creando usuario de prueba...');
    
    const testUser = await prisma.user.upsert({
      where: { email_address: 'user@test' },
      update: {},
      create: {
        name: 'Usuario Prueba',
        email_address: 'user@test',
        password: await bcrypt.hash('user123', 10),
        phone_number: '0987654321',
        registration_date: new Date(),
        role: 'user',
        age: 25,
        gender: 'other'
      }
    });
    
    console.log('✅ Usuario prueba creado: user@test / user123');

    console.log('\n🎉 ¡Datos de prueba creados exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   👤 Usuarios: 2 (admin + user)`);
    console.log(`   📂 Categorías: ${categories.length}`);
    console.log(`   🛍️  Productos: ${products.length}`);
    console.log(`   📦 Estados pedido: ${orderStatuses.length}`);
    
    console.log('\n🔑 Credenciales de acceso:');
    console.log('   Admin: admin@test / admin123');
    console.log('   User:  user@test / user123');

  } catch (error) {
    console.error('❌ Error creando datos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();
