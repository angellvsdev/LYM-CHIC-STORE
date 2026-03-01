// SSL Certificate Fix for Development
// Add this to your package.json scripts:
// "dev": "NODE_TLS_REJECT_UNAUTHORIZED=0 next dev"

// Or run this before starting your dev server:
// export NODE_TLS_REJECT_UNAUTHORIZED=0

// For Windows (Command Prompt):
// set NODE_TLS_REJECT_UNAUTHORIZED=0
// npm run dev

// For Windows (PowerShell):
// $env:NODE_TLS_REJECT_UNAUTHORIZED="0"
// npm run dev

// For Linux/Mac:
// export NODE_TLS_REJECT_UNAUTHORIZED=0
// npm run dev

console.log('SSL Certificate Fix Applied');
console.log('This should only be used in development!');
console.log('Do NOT use this in production!');
