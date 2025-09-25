# Solución de Errores 500 - Base de Datos

## 🔍 Diagnóstico del Problema

El error 500 que estás experimentando al cargar las tablas de datos se debe principalmente a problemas de configuración de la base de datos. Los errores específicos son:

- **AxiosError: Request failed with status code 500** en `fetchCategories`
- Problemas de conexión con PostgreSQL
- Falta de archivo `.env` con configuración de base de datos
- Inconsistencias en las importaciones de Prisma

## 🛠️ Solución Paso a Paso

### 1. Configurar Variables de Entorno

Primero, ejecuta el script de configuración:

```bash
npm run setup
```

Esto creará un archivo `.env` con la configuración básica. **Edita este archivo** con tus credenciales reales de PostgreSQL:

```env
DATABASE_URL="postgresql://tu_usuario:tu_password@localhost:5432/lym_dev_db"
SECRET_COOKIE_PASSWORD="tu-contraseña-secreta-de-al-menos-32-caracteres"
NODE_ENV="development"
```

### 2. Configurar Base de Datos PostgreSQL

Asegúrate de que PostgreSQL esté instalado y ejecutándose. Luego:

```bash
# Crear la base de datos (si no existe)
createdb lym_dev_db

# Aplicar migraciones
npm run db:migrate

# Poblar con datos de prueba
npm run db:seed
```

### 3. Verificar Configuración

Ejecuta el diagnóstico para verificar que todo esté funcionando:

```bash
npm run diagnose
```

### 4. Reiniciar Servidor

```bash
npm run dev
```

## 🔧 Scripts Útiles

- `npm run setup` - Configurar archivo .env
- `npm run diagnose` - Diagnosticar problemas de base de datos
- `npm run db:reset` - Reiniciar base de datos (cuidado: borra todos los datos)
- `npm run db:migrate` - Aplicar migraciones
- `npm run db:seed` - Poblar con datos de prueba
- `npm run db:studio` - Abrir Prisma Studio para ver datos

## 🐛 Problemas Comunes y Soluciones

### Error P1001: Can't reach database server
- Verifica que PostgreSQL esté ejecutándose
- Verifica las credenciales en el archivo `.env`
- Verifica que la base de datos exista

### Error P2002: Unique constraint failed
- Ejecuta `npm run db:reset` para limpiar datos duplicados

### Error de validación de esquemas
- Los esquemas han sido actualizados para incluir relaciones con categorías
- Verifica que las migraciones estén aplicadas

## 📝 Notas Importantes

1. **Archivo .env**: Nunca subas este archivo a Git (ya está en .gitignore)
2. **Base de datos**: Asegúrate de que PostgreSQL esté instalado y ejecutándose
3. **Migraciones**: Siempre ejecuta las migraciones después de cambios en el esquema
4. **Datos de prueba**: El seed creará categorías y productos de ejemplo

## 🚀 Después de la Configuración

Una vez configurado correctamente, deberías poder:
- Ver las categorías cargando en la página principal
- Ver los productos en el catálogo
- Navegar sin errores 500

Si sigues teniendo problemas, ejecuta `npm run diagnose` y comparte la salida para obtener ayuda adicional.
