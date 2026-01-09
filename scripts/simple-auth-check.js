// @ts-check
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function checkAuth() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Verificando usuarios...');
    
    // Obtener todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        user_id: true,
        name: true,
        email_address: true,
        password: true,
        role: true
      }
    });

    console.log(`\n📋 Usuarios encontrados: ${users.length}\n`);

    // Verificar cada usuario
    for (const user of users) {
      console.log(`👤 Usuario: ${user.name} (${user.email_address})`);
      console.log(`   - ID: ${user.user_id}`);
      console.log(`   - Rol: ${user.role}`);
      
      // Verificar formato de contraseña
      const isBcryptHash = user.password && (
        user.password.startsWith('$2a$') || 
        user.password.startsWith('$2b$') || 
        user.password.startsWith('$2y$')
      );
      
      console.log(`   - Formato de contraseña: ${isBcryptHash ? '✅ Hash bcrypt' : '❌ Texto plano'}`);
      
      // Probar con contraseña común
      const commonPasswords = ['changeme', 'password', 'admin123', '12345678'];
      let foundMatch = false;
      
      for (const pwd of commonPasswords) {
        if (isBcryptHash) {
          const match = await bcrypt.compare(pwd, user.password);
          if (match) {
            console.log(`   ⚠️  Contraseña débil detectada: "${pwd}"`);
            foundMatch = true;
            break;
          }
        } else if (user.password === pwd) {
          console.log(`   ⚠️  Contraseña en texto plano: "${pwd}"`);
          foundMatch = true;
          break;
        }
      }
      
      if (!foundMatch && !isBcryptHash) {
        console.log(`   - Contraseña en texto plano: "${user.password}"`);
      }
      
      console.log();
    }
    
    // Probar autenticación con un usuario específico
    const testEmail = 'admin@example.com';
    console.log(`\n🔐 Probando autenticación para: ${testEmail}`);
    
    const testUser = await prisma.user.findUnique({
      where: { email_address: testEmail }
    });
    
    if (testUser) {
      console.log(`   - Usuario encontrado: ${testUser.name}`);
      
      // Probar con contraseña correcta
      const testPasswords = [
        { pwd: 'admin123', desc: 'Contraseña esperada' },
        { pwd: 'changeme', desc: 'Contraseña por defecto' },
        { pwd: 'password', desc: 'Contraseña común' }
      ];
      
      for (const { pwd, desc } of testPasswords) {
        const isValid = await bcrypt.compare(pwd, testUser.password || '');
        console.log(`   - ${desc} (${pwd}): ${isValid ? '✅ VÁLIDA' : '❌ inválida'}`);
      }
    } else {
      console.log(`   ❌ Usuario no encontrado: ${testEmail}`);
    }
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAuth().catch(console.error);
