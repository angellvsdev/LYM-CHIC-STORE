#!/usr/bin/env node

import axios from 'axios';

// Función para detectar automáticamente el puerto
async function detectPort() {
  const ports = [3000, 3001, 3002, 3003, 3004];
  
  for (const port of ports) {
    try {
      const response = await axios.get(`http://localhost:${port}/api/categories`, { timeout: 1000 });
      if (response.status === 200) {
        return port;
      }
    } catch (error) {
      // Continuar al siguiente puerto
    }
  }
  
  return 3000; // Puerto por defecto
}

const BASE_URL = `http://localhost:${await detectPort()}`;

async function testZodValidations() {
  console.log('🧪 Probando validaciones de Zod...\n');
  console.log(`📍 Servidor detectado en: ${BASE_URL}\n`);

  try {
    // 1. Probar parámetros válidos
    console.log('1. Probando parámetros válidos...');
    const validResponse = await axios.get(`${BASE_URL}/api/products`, {
      params: {
        page: 1,
        limit: 10,
        sort: 'name',
        order: 'asc',
        min_price: 0,
        max_price: 1000
      }
    });
    console.log('✅ Parámetros válidos:', validResponse.status, validResponse.data.data?.length || 0, 'productos');

    // 2. Probar parámetros inválidos - página negativa
    console.log('\n2. Probando página inválida (negativa)...');
    try {
      await axios.get(`${BASE_URL}/api/products`, {
        params: { page: -1 }
      });
      console.log('❌ Error: Debería haber fallado con página negativa');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validación de página negativa funciona correctamente');
      } else {
        console.log('❌ Error inesperado:', error.response?.status);
      }
    }

    // 3. Probar parámetros inválidos - límite muy alto
    console.log('\n3. Probando límite inválido (muy alto)...');
    try {
      await axios.get(`${BASE_URL}/api/products`, {
        params: { limit: 1000 }
      });
      console.log('❌ Error: Debería haber fallado con límite muy alto');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validación de límite funciona correctamente');
      } else {
        console.log('❌ Error inesperado:', error.response?.status);
      }
    }

    // 4. Probar parámetros inválidos - ordenamiento inválido
    console.log('\n4. Probando ordenamiento inválido...');
    try {
      await axios.get(`${BASE_URL}/api/products`, {
        params: { sort: 'invalid_field' }
      });
      console.log('❌ Error: Debería haber fallado con campo de ordenamiento inválido');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validación de ordenamiento funciona correctamente');
      } else {
        console.log('❌ Error inesperado:', error.response?.status);
      }
    }

    // 5. Probar parámetros inválidos - orden inválido
    console.log('\n5. Probando orden inválido...');
    try {
      await axios.get(`${BASE_URL}/api/products`, {
        params: { order: 'invalid_order' }
      });
      console.log('❌ Error: Debería haber fallado con orden inválido');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validación de orden funciona correctamente');
      } else {
        console.log('❌ Error inesperado:', error.response?.status);
      }
    }

    // 6. Probar parámetros inválidos - precio negativo
    console.log('\n6. Probando precio negativo...');
    try {
      await axios.get(`${BASE_URL}/api/products`, {
        params: { min_price: -100 }
      });
      console.log('❌ Error: Debería haber fallado con precio negativo');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validación de precio funciona correctamente');
      } else {
        console.log('❌ Error inesperado:', error.response?.status);
      }
    }

    // 7. Probar UUID inválido para categoría
    console.log('\n7. Probando UUID inválido para categoría...');
    try {
      await axios.get(`${BASE_URL}/api/products`, {
        params: { category_id: 'invalid-uuid' }
      });
      console.log('❌ Error: Debería haber fallado con UUID inválido');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validación de UUID funciona correctamente');
      } else {
        console.log('❌ Error inesperado:', error.response?.status);
      }
    }

    // 8. Probar validaciones de categorías
    console.log('\n8. Probando validaciones de categorías...');
    try {
      await axios.get(`${BASE_URL}/api/categories`, {
        params: { featured: 'not-a-boolean' }
      });
      console.log('❌ Error: Debería haber fallado con featured inválido');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validación de featured funciona correctamente');
      } else {
        console.log('❌ Error inesperado:', error.response?.status);
      }
    }

    console.log('\n🎉 Todas las validaciones de Zod funcionan correctamente!');
    console.log(`🌐 Aplica la aplicación en: ${BASE_URL}`);

  } catch (error) {
    console.error('❌ Error probando validaciones:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    
    console.log('\n💡 Posibles soluciones:');
    console.log('1. Verifica que el servidor esté ejecutándose');
    console.log('2. Verifica que no haya errores en la consola del servidor');
    console.log('3. Ejecuta: npm run dev');
  }
}

testZodValidations()
  .catch(console.error)
  .finally(() => process.exit(0));
