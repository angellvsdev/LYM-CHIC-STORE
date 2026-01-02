# 👥 Usuarios de Prueba para Desarrollo

## 📋 Credenciales de Prueba

### 👑 **Administrador**
- **Email**: `admin@test.com`
- **Contraseña**: `admin123456`
- **Rol**: `admin`
- **Funcionalidad**: Acceso completo al panel de administración

### 👤 **Usuario Regular**
- **Email**: `user@test.com`
- **Contraseña**: `user123456`
- **Rol**: `user`
- **Funcionalidad**: Acceso al perfil básico de usuario

## 🚀 Cómo Crear Usuarios de Prueba

### Opción 1: Script Rápido (Recomendado)
```bash
npm run db:create-test-users
```

### Opción 2: Reset y Recrear (Si hay problemas)
```bash
npm run db:reset-test-users
```

### Opción 3: Seeding Completo
```bash
# Resetear la base de datos completamente
npm run db:reset

# Aplicar migraciones
npm run db:migrate

# Ejecutar seeding completo (incluye usuarios de prueba)
npm run db:seed

## 🧪 Casos de Prueba

### **Prueba 1: Login como Administrador**
1. Ve a la página de login (`/login`)
2. Ingresa: `admin@test.com` / `admin123456`
3. Después del login, deberías ver:
   - ✅ **Redirección automática** al panel de administración (`/admin`)
   - ✅ **Navbar muestra** ícono de configuración (⚙️) en lugar de perfil
   - ✅ **Acceso completo** al panel de administración con todas las funciones

### **Prueba 2: Login como Usuario Regular**
1. Ve a la página de login (`/login`)
2. Ingresa: `user@test.com` / `user123456`
3. Después del login, deberías ver:
   - ✅ **Redirección automática** a la página principal (`/`)
   - ✅ **Navbar muestra** ícono de perfil (👤)
   - ✅ **Acceso** al perfil de usuario básico

### **Prueba 3: Protección de Rutas de Admin**
1. **Como usuario regular**, intenta acceder directamente a `/admin`
2. Deberías ser **redirigido automáticamente** a la página de inicio (`/`)
3. **Como administrador**, podrás acceder normalmente al panel

### **Prueba 4: Logout**
1. Desde cualquier página autenticada, haz clic en el botón de logout
3. El navbar debería mostrar los botones de login/registro nuevamente según el estado de autenticación

## 🔧 Funcionalidades a Probar

- ✅ **Autenticación**: Login/logout funcional
- ✅ **Redirección automática**: Admin → `/admin`, Usuario → `/`
- ✅ **Protección de rutas**: Panel de admin solo accesible para administradores
- ✅ **Logout con redirección**: Siempre redirige a página de inicio

## 🐛 Solución de Problemas

### Error: "Usuario no encontrado"
- Asegúrate de haber ejecutado `npm run db:create-test-users` o `npm run db:reset-test-users`
- Verifica que la base de datos esté corriendo

### Error: "Contraseña incorrecta"
- Las contraseñas están hasheadas con bcrypt
- Usa exactamente: `admin123456` o `user123456`

### Error: "String must contain at least 8 character(s)"
- Este error indica que la contraseña debe tener mínimo 8 caracteres
- Usa las contraseñas proporcionadas arriba que cumplen este requisito

### Navbar no se actualiza después del login
- Recarga la página para forzar la actualización del contexto
- Verifica que el `AuthProvider` esté correctamente configurado

## 🗑️ Limpiar Usuarios de Prueba

Si necesitas eliminar los usuarios de prueba:

```bash
# Opción 1: Usar el script de reset
npm run db:reset-test-users

# Opción 2: Eliminar usuarios específicos desde Prisma Studio
npx prisma studio
# Luego eliminar manualmente desde la interfaz web

# Opción 3: Reset completo (elimina TODOS los datos)
npm run db:reset
npm run db:migrate
```

## 📝 Notas

- Los usuarios de prueba usan contraseñas simples para facilitar el desarrollo
- En producción, asegúrate de cambiar estas contraseñas o eliminar estos usuarios
- Los usuarios incluyen datos adicionales (edad, género, teléfono) para testing completo
