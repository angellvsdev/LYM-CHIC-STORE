const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testEndpoint(method, url, data = null) {
    try {
        console.log(`Testing ${method.toUpperCase()} ${url}...`);
        
        let response;
        switch (method.toLowerCase()) {
            case 'get':
                response = await axios.get(`${BASE_URL}${url}`);
                break;
            case 'post':
                response = await axios.post(`${BASE_URL}${url}`, data);
                break;
            case 'put':
                response = await axios.put(`${BASE_URL}${url}`, data);
                break;
            case 'patch':
                response = await axios.patch(`${BASE_URL}${url}`, data);
                break;
            case 'delete':
                response = await axios.delete(`${BASE_URL}${url}`);
                break;
        }
        
        console.log(`✅ ${method.toUpperCase()} ${url} - Status: ${response.status}`);
        return { success: true, status: response.status, data: response.data };
    } catch (error) {
        console.log(`❌ ${method.toUpperCase()} ${url} - Error: ${error.response?.status || error.message}`);
        return { success: false, status: error.response?.status, error: error.message };
    }
}

async function runTests() {
    console.log('🧪 Testing API Endpoints...\n');
    
    const tests = [
        // Categories API
        { method: 'GET', url: '/api/categories' },
        
        // Products API (Public)
        { method: 'GET', url: '/api/products' },
        { method: 'GET', url: '/api/products?category_id=test&search=test&page=1&limit=5' },
        
        // Admin Products API
        { method: 'GET', url: '/api/admin/products' },
        { method: 'GET', url: '/api/admin/products?category=test&search=test&page=1&limit=5' },
        
        // Admin Orders API
        { method: 'GET', url: '/api/admin/orders' },
        { method: 'GET', url: '/api/admin/orders?status=received&page=1&limit=5' },
        
        // Test with invalid data to check error handling
        { 
            method: 'POST', 
            url: '/api/admin/products', 
            data: { name: 'Test Product' } // Missing required fields
        },
        { 
            method: 'POST', 
            url: '/api/admin/orders', 
            data: { user_id: 'invalid' } // Invalid data
        }
    ];
    
    const results = [];
    
    for (const test of tests) {
        const result = await testEndpoint(test.method, test.url, test.data);
        results.push({ ...test, ...result });
        
        // Wait a bit between requests
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    console.log(`📈 Success Rate: ${((successful.length / results.length) * 100).toFixed(1)}%`);
    
    if (failed.length > 0) {
        console.log('\n❌ Failed Tests:');
        failed.forEach(test => {
            console.log(`   ${test.method.toUpperCase()} ${test.url} - Status: ${test.status}`);
        });
    }
    
    console.log('\n🎉 Testing completed!');
}

// Run the tests
runTests().catch(console.error);
