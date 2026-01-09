import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword } from '../src/lib/auth/password';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function diagnoseAuth() {
  try {
    console.log('=== Diagnóstico de Autenticación ===\n');
    
    // 1. Obtener todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        user_id: true,
        name: true,
        email_address: true,
        password: true,
        role: true
      }
    });

    console.log(`📋 Usuarios encontrados: ${users.length}\n`);

    // 2. Verificar cada usuario
    for (const user of users) {
      console.log(`🔍 Analizando usuario: ${user.name} (${user.email_address})`);
      console.log(`   - ID: ${user.user_id}`);
      console.log(`   - Rol: ${user.role}`);
      
      // Verificar si la contraseña está hasheada
      const isBcryptHash = user.password.startsWith('$2a$') || 
                          user.password.startsWith('$2b$') || 
                          user.password.startsWith('$2y$');
      
      console.log(`   - Contraseña hasheada: ${isBcryptHash ? '✅ Sí' : '❌ No'}`);
      
      if (isBcryptHash) {
        // Verificar si la contraseña es 'changeme' (para propósitos de diagnóstico)
        const isDefaultPassword = await bcrypt.compare('changeme', user.password);
        if (isDefaultPassword) {
          console.log('   ⚠️  Usa la contraseña por defecto "changeme"');
        }
      } else {
        console.log(`   ⚠️  Contraseña en texto plano: "${user.password}"`);
      }
      
      console.log();
    }

    // 3. Probar autenticación con un usuario de prueba
    const testEmail = 'admin@example.com';
    console.log(`\n🔐 Probando autenticación para: ${testEmail}`);
    
    const testUser = await prisma.user.findUnique({
      where: { email_address: testEmail }
    });

    if (testUser) {
      console.log(`   - Usuario encontrado: ${testUser.name}`);
      
      // Probar con contraseña correcta
      const testPassword = 'admin123';
      const isValid = await bcrypt.compare(testPassword, testUser.password || '');
      
      console.log(`   - Contraseña "${testPassword}" es válida: ${isValid ? '✅ Sí' : '❌ No'}`);
      
      // Probar con contraseña incorrecta
      const invalidPassword = 'contraseñaincorrecta';
      const isInvalid = await bcrypt.compare(invalidPassword, testUser.password || '');
      console.log(`   - Contraseña incorrecta detectada como inválida: ${!isInvalid ? '✅ Sí' : '❌ No'}`);
      
      // Mostrar información del hash
      if (testUser.password) {
        const hashParts = testUser.password.split('$');
        console.log('\n🔧 Información del hash de contraseña:');
        console.log(`   - Algoritmo: ${hashParts[1]}`);
        console.log(`   - Coste (salt rounds): ${hashParts[2]?.substring(0, 2)}`);
      }
    } else {
      console.log(`   ❌ Usuario no encontrado: ${testEmail}`);
    }

  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error);
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseAuth()
  .catch((e) => {
    console.error('❌ Error en el diagnóstico:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
