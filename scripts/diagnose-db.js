#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function diagnoseDatabase() {
  console.log('🔍 Iniciando diagnóstico de la base de datos...\n');

  try {
    // Verificar conexión a la base de datos
    console.log('1. Verificando conexión a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa a la base de datos\n');

    // Verificar si las tablas existen
    console.log('2. Verificando tablas...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('✅ Tablas encontradas:', tables);
    console.log('');

    // Verificar datos en categorías
    console.log('3. Verificando datos en categorías...');
    const categories = await prisma.category.findMany();
    console.log(`✅ ${categories.length} categorías encontradas`);
    if (categories.length > 0) {
      console.log('Primeras 3 categorías:', categories.slice(0, 3).map(c => ({ id: c.id, name: c.name })));
    }
    console.log('');

    // Verificar datos en productos
    console.log('4. Verificando datos en productos...');
    const products = await prisma.product.findMany({
      include: { category: true },
      take: 3
    });
    console.log(`✅ ${products.length} productos encontrados (mostrando primeros 3)`);
    if (products.length > 0) {
      console.log('Productos con categorías:', products.map(p => ({ 
        id: p.id, 
        name: p.name, 
        category: p.category.name 
      })));
    }
    console.log('');

    // Verificar migraciones
    console.log('5. Verificando estado de migraciones...');
    const migrations = await prisma.$queryRaw`
      SELECT * FROM _prisma_migrations ORDER BY finished_at DESC
    `;
    console.log(`✅ ${migrations.length} migraciones aplicadas`);
    console.log('');

  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error);
    
    if (error.code === 'P1001') {
      console.log('\n💡 Solución sugerida:');
      console.log('1. Verifica que PostgreSQL esté ejecutándose');
      console.log('2. Verifica que la URL de la base de datos sea correcta');
      console.log('3. Crea un archivo .env con la configuración correcta');
      console.log('4. Ejecuta: npx prisma migrate dev');
    }
    
    if (error.code === 'P2002') {
      console.log('\n💡 Solución sugerida:');
      console.log('1. Verifica que no haya datos duplicados');
      console.log('2. Ejecuta: npx prisma migrate reset');
    }
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseDatabase()
  .catch(console.error)
  .finally(() => process.exit(0));
