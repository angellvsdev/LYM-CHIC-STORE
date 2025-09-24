#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

async function checkDatabaseConfig() {
  console.log('🔍 Verificando configuración de base de datos...\n');

  try {
    // Verificar variables de entorno
    console.log('1. Variables de entorno:');
    console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada');
    console.log('   NODE_ENV:', process.env.NODE_ENV || 'No configurado');
    console.log('');

    // Intentar conectar con Prisma
    console.log('2. Intentando conectar con Prisma...');
    const prisma = new PrismaClient();
    
    await prisma.$connect();
    console.log('✅ Conexión exitosa con Prisma');
    
    // Probar una consulta simple
    const categoryCount = await prisma.category.count();
    console.log(`✅ Consulta exitosa: ${categoryCount} categorías encontradas`);
    
    await prisma.$disconnect();
    console.log('✅ Desconexión exitosa');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('Can\'t reach database server')) {
      console.log('\n💡 El problema es de conectividad con la base de datos');
      console.log('Posibles soluciones:');
      console.log('1. Verifica que la URL de la base de datos sea correcta');
      console.log('2. Verifica que la base de datos esté accesible');
      console.log('3. Verifica tu conexión a internet (si es Supabase)');
    }
  }
}

checkDatabaseConfig()
  .catch(console.error)
  .finally(() => process.exit(0));
