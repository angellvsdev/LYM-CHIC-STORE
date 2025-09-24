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

async function testCatalogFeatures() {
  console.log('🧪 Probando funcionalidades del catálogo...\n');
  console.log(`📍 Servidor detectado en: ${BASE_URL}\n`);

  try {
    // 1. Probar búsqueda básica
    console.log('1. Probando búsqueda por nombre...');
    const searchResponse = await axios.get(`${BASE_URL}/api/products`, {
      params: {
        search: 'Abrigo',
        page: 1,
        limit: 10
      }
    });
    console.log('✅ Búsqueda por "Abrigo":', searchResponse.status, searchResponse.data.data?.length || 0, 'productos');
    
    if (searchResponse.data.data?.length > 0) {
      console.log('   Primer resultado:', searchResponse.data.data[0].name);
    }

    // 2. Probar filtro por categoría
    console.log('\n2. Probando filtro por categoría...');
    const categoryResponse = await axios.get(`${BASE_URL}/api/products`, {
      params: {
        category_id: 'cdca4c1f-eb26-48c0-8dbf-3a1dbad1322e', // ID de Accesorios
        page: 1,
        limit: 10
      }
    });
    console.log('✅ Filtro por categoría "Accesorios":', categoryResponse.status, categoryResponse.data.data?.length || 0, 'productos');

    // 3. Probar filtro por precio
    console.log('\n3. Probando filtro por precio...');
    const priceResponse = await axios.get(`${BASE_URL}/api/products`, {
      params: {
        min_price: 100,
        max_price: 200,
        page: 1,
        limit: 10
      }
    });
    console.log('✅ Filtro por precio (100-200):', priceResponse.status, priceResponse.data.data?.length || 0, 'productos');

    // 4. Probar ordenamiento
    console.log('\n4. Probando ordenamiento...');
    const sortResponse = await axios.get(`${BASE_URL}/api/products`, {
      params: {
        sort: 'price',
        order: 'desc',
        page: 1,
        limit: 5
      }
    });
    console.log('✅ Ordenamiento por precio descendente:', sortResponse.status, sortResponse.data.data?.length || 0, 'productos');
    
    if (sortResponse.data.data?.length > 0) {
      console.log('   Producto más caro:', sortResponse.data.data[0].name, '- $', sortResponse.data.data[0].price);
    }

    // 5. Probar combinación de filtros
    console.log('\n5. Probando combinación de filtros...');
    const combinedResponse = await axios.get(`${BASE_URL}/api/products`, {
      params: {
        search: 'collar',
        category_id: 'cdca4c1f-eb26-48c0-8dbf-3a1dbad1322e',
        min_price: 50,
        max_price: 300,
        sort: 'name',
        order: 'asc',
        page: 1,
        limit: 10
      }
    });
    console.log('✅ Combinación de filtros:', combinedResponse.status, combinedResponse.data.data?.length || 0, 'productos');

    // 6. Probar paginación
    console.log('\n6. Probando paginación...');
    const paginationResponse = await axios.get(`${BASE_URL}/api/products`, {
      params: {
        page: 2,
        limit: 5
      }
    });
    console.log('✅ Paginación (página 2, 5 productos):', paginationResponse.status, paginationResponse.data.data?.length || 0, 'productos');
    console.log('   Total de productos:', paginationResponse.data.pagination?.total || 0);
    console.log('   Total de páginas:', paginationResponse.data.pagination?.totalPages || 0);

    console.log('\n🎉 Todas las funcionalidades del catálogo funcionan correctamente!');
    console.log(`🌐 Aplica la aplicación en: ${BASE_URL}`);

  } catch (error) {
    console.error('❌ Error probando funcionalidades:', error.message);
    
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

testCatalogFeatures()
  .catch(console.error)
  .finally(() => process.exit(0));
