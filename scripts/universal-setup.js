#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Configuración universal de LYM Dev\n');

try {
  // 1. Verificar que estamos en el directorio correcto
  console.log('1. Verificando estructura del proyecto...');
  if (!fs.existsSync('package.json')) {
    console.log('❌ No se encontró package.json. Asegúrate de estar en el directorio del proyecto.');
    process.exit(1);
  }
  console.log('✅ Estructura del proyecto verificada');

  // 2. Verificar archivo .env
  console.log('\n2. Verificando archivo .env...');
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('⚠️  El archivo .env no existe');
    console.log('💡 Crea un archivo .env con las siguientes variables:');
    console.log('   DATABASE_URL="tu_url_de_base_de_datos"');
    console.log('   SECRET_COOKIE_PASSWORD="tu_contraseña_secreta"');
    console.log('   NODE_ENV="development"');
  } else {
    console.log('✅ Archivo .env encontrado');
  }

  // 3. Generar cliente de Prisma
  console.log('\n3. Generando cliente de Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Cliente de Prisma generado');

  // 4. Verificar base de datos
  console.log('\n4. Verificando conexión a la base de datos...');
  execSync('npm run diagnose', { stdio: 'inherit' });
  console.log('✅ Base de datos verificada');

  console.log('\n🎉 Configuración completada exitosamente!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Ejecuta: npm run dev');
  console.log('2. El servidor se iniciará automáticamente en el puerto disponible');
  console.log('3. Ejecuta: npm run test-api (detectará automáticamente el puerto)');
  console.log('4. Abre la URL que aparezca en la consola del servidor');

} catch (error) {
  console.error('\n❌ Error durante la configuración:', error.message);
  console.log('\n💡 Soluciones posibles:');
  console.log('1. Verifica que PostgreSQL esté instalado y ejecutándose');
  console.log('2. Verifica que tengas permisos para crear bases de datos');
  console.log('3. Verifica que el archivo .env tenga la configuración correcta');
}
