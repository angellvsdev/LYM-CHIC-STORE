// Script para limpiar localStorage y recargar la aplicación
// Ejecutar esto en la consola del navegador (F12 -> Console)

console.log("🧹 Limpiando datos de autenticación...");

// Limpiar localStorage
localStorage.removeItem('user');
localStorage.clear();

console.log("✅ localStorage limpiado");

// Recargar la página para obtener estado fresco
window.location.reload();

console.log("🔄 Página recargada - Estado limpio obtenido");
