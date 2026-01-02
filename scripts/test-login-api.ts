async function testLoginAPI() {
  console.log("🌐 Probando API de login directamente...");

  try {
    const testCredentials = [
      { email: "admin@test.com", password: "admin123456", description: "Administrador" },
      { email: "user@test.com", password: "user123456", description: "Usuario Regular" }
    ];

    for (const cred of testCredentials) {
      console.log(`\n🔑 Probando ${cred.description}:`);
      console.log(`   Email: ${cred.email}`);

      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: cred.email,
          password: cred.password
        }),
      });

      console.log(`   Status: ${response.status}`);
      console.log(`   Content-Type: ${response.headers.get('content-type')}`);

      const data = await response.json();
      console.log(`   Response:`, data);

      if (response.ok) {
        console.log(`   ✅ Login exitoso para ${cred.description}`);
      } else {
        console.log(`   ❌ Error: ${data.message}`);
      }
    }

  } catch (error: unknown) {
    console.error("❌ Error conectando con la API:", error instanceof Error ? error.message : String(error));
    console.log("💡 Asegúrate de que la aplicación esté corriendo con 'npm run dev'");
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testLoginAPI();
}

export { testLoginAPI };
