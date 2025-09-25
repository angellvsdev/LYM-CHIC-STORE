# Panel de Administración - LYM Marketplace

## Descripción General

El panel de administración es una interfaz completa para gestionar todos los aspectos del marketplace LYM, diseñado siguiendo las mejores prácticas de UX/UI y optimizado para el flujo de trabajo del administrador.

## Características Principales

### 1. Dashboard Centralizado
- **Estadísticas en Tiempo Real**: Pedidos totales, ingresos, productos activos, clientes
- **Métricas de Rendimiento**: Valor promedio por pedido, pedidos del mes, ingresos del mes
- **Vista General**: Resumen de pedidos recientes y productos más vendidos

### 2. Gestión de Pedidos
- **Flujo de Trabajo Completo**: Desde "Pedido Recibido" hasta "Completado"
- **Estados de Pedido**:
  - `received` - Pedido Recibido
  - `preparing` - En Preparación
  - `ready` - Listo para Recoger
  - `picked` - Recogido
  - `completed` - Completado
- **Notificaciones Automáticas**: WhatsApp integrado para comunicación con clientes
- **Filtros Avanzados**: Por estado, cliente, fecha, número de pedido

### 3. Gestión de Productos
- **CRUD Completo**: Crear, leer, actualizar, eliminar productos
- **Gestión de Inventario**: Control de stock en tiempo real
- **Categorización**: Organización por categorías
- **Imágenes Múltiples**: Soporte para galería de imágenes
- **SKU y Dimensiones**: Información detallada de productos

### 4. Gestión de Clientes
- **Base de Datos de Clientes**: Información completa de contacto
- **Historial de Pedidos**: Seguimiento de compras por cliente
- **Segmentación**: Clientes VIP, regulares, nuevos
- **Estadísticas**: Total gastado, frecuencia de compra

### 5. Herramientas de Búsqueda y Filtrado
- **Búsqueda Global**: En productos, pedidos, clientes
- **Filtros Específicos**: Por categoría, estado, fecha, precio
- **Paginación**: Navegación eficiente en grandes volúmenes de datos

## Flujo de Trabajo del Pedido

### Escenario: Cliente Laura - Set de Tazas de Cerámica

#### 1. Solicitud del Pedido
```
Cliente: Laura García
Producto: Set de Tazas de Cerámica
Número de pedido: PED-2024-0015
Método de entrega: Recogida en Tienda
```

**UI del Cliente:**
- Laura navega por el marketplace
- Añade producto al carrito
- Completa formulario con datos personales
- Confirma pedido
- Recibe confirmación con número de pedido

#### 2. Pedido Recibido (Estado Inicial)
**Panel de Administración:**
- Aparece en sección "Pedidos" con estado "Pedido Recibido"
- Datos mostrados:
  - Número: PED-2024-0015
  - Cliente: Laura García
  - Producto: Set de Tazas de Cerámica
  - Cantidad: 1
  - Fecha/Hora: 2024-10-27 10:00 AM
  - Estado: Pedido Recibido

**Notificación Automática:**
- WhatsApp enviado a Laura: "¡Hola Laura! Hemos recibido tu pedido PED-2024-0015. Te notificaremos cuando esté listo para recoger. 📦"

#### 3. En Preparación
**Acción del Administrador:**
- Selecciona pedido PED-2024-0015
- Cambia estado a "En Preparación"
- Sistema actualiza estado en tiempo real

**Notificación Automática:**
- WhatsApp enviado: "¡Hola Laura! Tu pedido PED-2024-0015 está siendo preparado. Te avisaremos cuando esté listo. ⏳"

#### 4. Listo para Recoger
**Acción del Administrador:**
- Cambia estado a "Listo para Recoger"
- Sistema registra cambio de estado

**Notificación Automática:**
- WhatsApp enviado: "¡Hola Laura! Tu pedido PED-2024-0015 está listo para recoger en nuestra tienda. Te esperamos! 🎉"

#### 5. Cliente Recoge el Pedido
**Proceso en Tienda:**
- Laura presenta número de pedido PED-2024-0015
- Administrador verifica identidad
- Entrega producto

**Acción del Administrador:**
- Cambia estado a "Recogido"

#### 6. Pedido Completado
**Acción Final:**
- Cambia estado a "Pedido Completado"
- Pedido se archiva en "Pedidos Completados"

## APIs del Backend

### Endpoints Principales

#### Dashboard
```
GET /api/admin/dashboard
```
Retorna estadísticas del dashboard en tiempo real.

#### Pedidos
```
GET /api/admin/orders?page=1&limit=10&status=received
PATCH /api/admin/orders
GET /api/admin/orders/[id]
DELETE /api/admin/orders/[id]
```

#### Productos
```
GET /api/admin/products?page=1&limit=10&category=vajilla
POST /api/admin/products
PUT /api/admin/products/[id]
DELETE /api/admin/products/[id]
```

#### Clientes
```
GET /api/admin/customers?page=1&limit=10&status=active
POST /api/admin/customers
PUT /api/admin/customers/[id]
```

## Servicio de WhatsApp

### Configuración
```typescript
// Variables de entorno requeridas
WHATSAPP_API_KEY=your_api_key
WHATSAPP_API_URL=https://api.whatsapp.com/v1/messages
```

### Funciones Disponibles
- `sendOrderReadyNotification()` - Pedido listo para recoger
- `sendOrderReceivedNotification()` - Pedido recibido
- `sendOrderPreparingNotification()` - Pedido en preparación
- `sendCustomNotification()` - Mensaje personalizado

### Validación de Teléfonos
- Formato internacional requerido (+1 555-123-4567)
- Validación automática de formato
- Limpieza de caracteres especiales

## Componentes del Frontend

### Estructura de Componentes
```
src/app/components/admin/
├── AdminSidebar.tsx      # Navegación lateral
├── AdminHeader.tsx       # Barra superior con búsqueda
├── DashboardStats.tsx    # Tarjetas de estadísticas
├── OrdersList.tsx        # Tabla de pedidos
├── ProductsOverview.tsx  # Tabla de productos
└── CustomersOverview.tsx # Tabla de clientes
```

### Hook Personalizado
```typescript
const {
    dashboardStats,
    orders,
    products,
    customers,
    updateOrderStatus,
    createProduct,
    createCustomer
} = useAdminData();
```

## Tipos TypeScript

### Interfaces Principales
```typescript
interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    status: 'received' | 'preparing' | 'ready' | 'picked' | 'completed';
    // ... más propiedades
}

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive' | 'out_of_stock';
    // ... más propiedades
}

interface Customer {
    id: string;
    name: string;
    email: string;
    totalOrders: number;
    totalSpent: number;
    // ... más propiedades
}
```

## Seguridad y Permisos

### Control de Acceso
- Autenticación requerida para todas las rutas admin
- Roles de usuario: `admin`, `manager`, `staff`
- Permisos granulares por funcionalidad

### Protección de Datos
- Validación de entrada en todas las APIs
- Sanitización de datos
- Logs de auditoría para cambios críticos

## Responsive Design

### Breakpoints
- **Desktop**: Sidebar fijo, layout completo
- **Tablet**: Sidebar colapsable
- **Mobile**: Sidebar overlay, navegación optimizada

### Características Mobile
- Menú hamburguesa para sidebar
- Tablas con scroll horizontal
- Botones de acción optimizados para touch

## Integración con Sistema Existente

### Compatibilidad
- Mantiene diseño y colores del proyecto principal
- Tipografía `font-grotesk` consistente
- Paleta de colores del `globals.css`
- Componentes reutilizables del sistema de diseño

### Navegación
- Botón de perfil agregado al navbar principal
- Enlace directo al panel de administración
- Navegación fluida entre secciones

## Próximas Mejoras

### Funcionalidades Planificadas
1. **Reportes Avanzados**: Exportación PDF/Excel
2. **Notificaciones Push**: Tiempo real en navegador
3. **Gestión de Inventario**: Alertas de stock bajo
4. **Analytics**: Métricas detalladas de ventas
5. **Integración con WhatsApp Business**: API oficial
6. **Sistema de Cupones**: Descuentos y promociones
7. **Gestión de Contenido**: Páginas dinámicas
8. **Backup Automático**: Base de datos y archivos

### Optimizaciones Técnicas
1. **Caché Inteligente**: Redis para datos frecuentes
2. **Lazy Loading**: Carga progresiva de componentes
3. **WebSockets**: Actualizaciones en tiempo real
4. **PWA**: Aplicación web progresiva
5. **Offline Mode**: Funcionalidad sin conexión

## Conclusión

El panel de administración proporciona una solución completa y escalable para la gestión del marketplace LYM, con un flujo de trabajo optimizado que mejora la eficiencia operativa y la experiencia del cliente. La arquitectura modular permite futuras expansiones y mejoras sin afectar la funcionalidad existente.



