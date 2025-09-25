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

async function testAPIEndpoints() {
  console.log('🧪 Probando endpoints de la API...\n');
  console.log(`📍 Servidor detectado en: ${BASE_URL}\n`);

  try {
    // Probar endpoint de categorías
    console.log('1. Probando /api/categories...');
    const categoriesResponse = await axios.get(`${BASE_URL}/api/categories`);
    console.log('✅ Categorías:', categoriesResponse.status, categoriesResponse.data.data?.length || 0, 'categorías');
    
    if (categoriesResponse.data.data?.length > 0) {
      console.log('   Primera categoría:', categoriesResponse.data.data[0].name);
    }

    // Probar endpoint de productos
    console.log('\n2. Probando /api/products...');
    const productsResponse = await axios.get(`${BASE_URL}/api/products`);
    console.log('✅ Productos:', productsResponse.status, productsResponse.data.data?.length || 0, 'productos');
    
    if (productsResponse.data.data?.length > 0) {
      console.log('   Primer producto:', productsResponse.data.data[0].name);
    }

    console.log('\n🎉 Todos los endpoints funcionan correctamente!');
    console.log(`🌐 Aplica la aplicación en: ${BASE_URL}`);

  } catch (error) {
    console.error('❌ Error probando endpoints:', error.message);
    
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

testAPIEndpoints()
  .catch(console.error)
  .finally(() => process.exit(0));
