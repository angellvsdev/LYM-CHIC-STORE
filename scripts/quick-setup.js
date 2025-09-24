#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Configuración rápida de LYM Dev\n');

try {
  // 1. Crear archivo .env si no existe
  console.log('1. Configurando variables de entorno...');
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    const envContent = `# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/lym_dev_db"

# Session Configuration
SECRET_COOKIE_PASSWORD="your-secret-password-min-32-chars-long-enough"

# Environment
NODE_ENV="development"
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Archivo .env creado');
    console.log('⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales reales de PostgreSQL');
  } else {
    console.log('✅ Archivo .env ya existe');
  }

  // 2. Generar cliente de Prisma
  console.log('\n2. Generando cliente de Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Cliente de Prisma generado');

  // 3. Aplicar migraciones
  console.log('\n3. Aplicando migraciones...');
  execSync('npx prisma migrate dev', { stdio: 'inherit' });
  console.log('✅ Migraciones aplicadas');

  // 4. Poblar con datos de prueba
  console.log('\n4. Poblando con datos de prueba...');
  execSync('npx prisma db seed', { stdio: 'inherit' });
  console.log('✅ Datos de prueba creados');

  console.log('\n🎉 Configuración completada exitosamente!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Edita el archivo .env con tus credenciales reales de PostgreSQL');
  console.log('2. Ejecuta: npm run dev');
  console.log('3. Abre http://localhost:3000 en tu navegador');

} catch (error) {
  console.error('\n❌ Error durante la configuración:', error.message);
  console.log('\n💡 Soluciones posibles:');
  console.log('1. Verifica que PostgreSQL esté instalado y ejecutándose');
  console.log('2. Verifica que tengas permisos para crear bases de datos');
  console.log('3. Ejecuta manualmente: npm run setup');
  console.log('4. Ejecuta manualmente: npm run diagnose');
}
