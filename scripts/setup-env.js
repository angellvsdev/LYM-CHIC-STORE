#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

function createEnvFile() {
  console.log('🔧 Configurando archivo .env...\n');

  const envContent = `# Database Configuration
# Cambia estos valores según tu configuración de PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/lym_dev_db"

# Session Configuration
# Cambia esta contraseña por una segura de al menos 32 caracteres
SECRET_COOKIE_PASSWORD="your-secret-password-min-32-chars-long-enough"

# Environment
NODE_ENV="development"
`;

  const envPath = path.join(process.cwd(), '.env');
  
  if (fs.existsSync(envPath)) {
    console.log('⚠️  El archivo .env ya existe');
    console.log('Por favor, verifica que contenga las variables necesarias:\n');
    console.log(envContent);
  } else {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Archivo .env creado exitosamente');
    console.log('📝 Por favor, edita el archivo .env con tus credenciales de base de datos\n');
  }

  console.log('📋 Pasos siguientes:');
  console.log('1. Edita el archivo .env con tus credenciales de PostgreSQL');
  console.log('2. Ejecuta: npx prisma migrate dev');
  console.log('3. Ejecuta: npx prisma db seed');
  console.log('4. Ejecuta: npm run dev');
}

createEnvFile();
