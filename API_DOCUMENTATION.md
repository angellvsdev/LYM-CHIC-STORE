# Documentación de la API

## Autenticación

La API utiliza autenticación basada en sesiones mediante `iron-session`. Para acceder a los endpoints protegidos, es necesario iniciar sesión primero.

### Endpoints de Autenticación

#### Registro de Usuario
- **POST** `/api/auth/register`
- **Body**:
  ```json
  {
    "name": "string",
    "email_address": "string",
    "phone_number": "string",
    "password": "string"
  }
  ```
- **Respuesta**: 201 Created
  ```json
  {
    "user_id": number,
    "name": "string",
    "email_address": "string",
    "phone_number": "string",
    "registration_date": "string"
  }
  ```

#### Inicio de Sesión
- **POST** `/api/auth/login`
- **Body**:
  ```json
  {
    "email_address": "string",
    "password": "string"
  }
  ```
- **Respuesta**: 200 OK
  ```json
  {
    "message": "Login successful"
  }
  ```

## Productos

### Obtener Lista de Productos
- **GET** `/api/products`
- **Query Params**:
  - `page`: número (default: 1)
  - `limit`: número (default: 10)
  - `search`: string
  - `sort`: string (default: "name")
  - `order`: "asc" | "desc" (default: "asc")
  - `category_id`: número
  - `min_price`: número
  - `max_price`: número
- **Respuesta**: 200 OK
  ```json
  {
    "data": [
      {
        "product_id": number,
        "name": "string",
        "description": "string",
        "price": number,
        "category": {
          "category_id": number,
          "category_name": "string"
        }
      }
    ],
    "pagination": {
      "total": number,
      "page": number,
      "limit": number,
      "totalPages": number
    }
  }
  ```

### Obtener Producto por ID
- **GET** `/api/products/[id]`
- **Respuesta**: 200 OK
  ```json
  {
    "product_id": number,
    "name": "string",
    "description": "string",
    "price": number,
    "category_id": number
  }
  ```

### Endpoints de Administración de Productos

#### Crear Producto
- **POST** `/api/products/admin`
- **Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "price": number,
    "category_id": number
  }
  ```
- **Respuesta**: 201 Created

#### Actualizar Producto
- **PUT** `/api/products/admin/[id]`
- **Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "price": number,
    "category_id": number
  }
  ```
- **Respuesta**: 200 OK

#### Eliminar Producto
- **DELETE** `/api/products/admin/[id]`
- **Respuesta**: 204 No Content

## Categorías

### Obtener Lista de Categorías
- **GET** `/api/categories`
- **Query Params**:
  - `page`: número (default: 1)
  - `limit`: número (default: 10)
  - `search`: string
  - `sort`: string (default: "category_name")
  - `order`: "asc" | "desc" (default: "asc")
- **Respuesta**: 200 OK
  ```json
  {
    "data": [
      {
        "category_id": number,
        "category_name": "string",
        "category_description": "string"
      }
    ],
    "pagination": {
      "total": number,
      "page": number,
      "limit": number,
      "totalPages": number
    }
  }
  ```

### Obtener Categoría por ID
- **GET** `/api/categories/[id]`
- **Respuesta**: 200 OK
  ```json
  {
    "category_id": number,
    "category_name": "string",
    "category_description": "string"
  }
  ```

### Endpoints de Administración de Categorías

#### Crear Categoría
- **POST** `/api/categories/admin`
- **Body**:
  ```json
  {
    "category_name": "string",
    "category_description": "string"
  }
  ```
- **Respuesta**: 201 Created

#### Actualizar Categoría
- **PUT** `/api/categories/admin?id=[id]`
- **Body**:
  ```json
  {
    "category_name": "string",
    "category_description": "string"
  }
  ```
- **Respuesta**: 200 OK

#### Eliminar Categoría
- **DELETE** `/api/categories/admin?id=[id]`
- **Respuesta**: 204 No Content

## Órdenes

### Obtener Lista de Órdenes
- **GET** `/api/orders`
- **Query Params**:
  - `page`: número (default: 1)
  - `limit`: número (default: 10)
  - `status`: número
  - `startDate`: fecha
  - `endDate`: fecha
  - `deliveryMethod`: string
  - `sortBy`: "order_date" | "order_status_id" | "order_number" (default: "order_date")
  - `sortOrder`: "asc" | "desc" (default: "desc")
- **Respuesta**: 200 OK
  ```json
  {
    "data": [
      {
        "order_id": number,
        "order_number": "string",
        "order_date": "string",
        "order_status_id": number,
        "delivery_method": "string",
        "orderStatus": {
          "order_status_id": number,
          "status_name": "string"
        },
        "order_details": [
          {
            "order_detail_id": number,
            "product_id": number,
            "quantity": number
          }
        ],
        "user": {
          "user_id": number,
          "name": "string"
        }
      }
    ],
    "pagination": {
      "total": number,
      "page": number,
      "limit": number,
      "totalPages": number
    }
  }
  ```

### Crear Orden
- **POST** `/api/orders`
- **Body**:
  ```json
  {
    "delivery_method": "string"
  }
  ```
- **Respuesta**: 201 Created

### Obtener Orden por ID
- **GET** `/api/orders/[id]`
- **Respuesta**: 200 OK
  ```json
  {
    "order_id": number,
    "order_number": "string",
    "order_date": "string",
    "order_status_id": number,
    "delivery_method": "string",
    "orderStatus": {
      "order_status_id": number,
      "status_name": "string"
    },
    "order_details": [
      {
        "order_detail_id": number,
        "product_id": number,
        "quantity": number
      }
    ],
    "user": {
      "user_id": number,
      "name": "string"
    }
  }
  ```

### Actualizar Estado de Orden
- **PUT** `/api/orders/[id]`
- **Body**:
  ```json
  {
    "order_status_id": number
  }
  ```
- **Respuesta**: 200 OK

### Eliminar Orden
- **DELETE** `/api/orders/[id]`
- **Respuesta**: 204 No Content

## Estados de Orden

### Obtener Lista de Estados de Orden
- **GET** `/api/order-statuses`
- **Query Params**:
  - `page`: número (default: 1)
  - `limit`: número (default: 10)
  - `search`: string
- **Respuesta**: 200 OK
  ```json
  {
    "data": [
      {
        "order_status_id": number,
        "status_name": "string",
        "status_description": "string"
      }
    ],
    "pagination": {
      "total": number,
      "page": number,
      "limit": number,
      "totalPages": number
    }
  }
  ```

### Obtener Estado de Orden por ID
- **GET** `/api/order-statuses/[id]`
- **Respuesta**: 200 OK
  ```json
  {
    "order_status_id": number,
    "status_name": "string",
    "status_description": "string"
  }
  ```

### Endpoints de Administración de Estados de Orden

#### Crear Estado de Orden
- **POST** `/api/order-statuses/admin`
- **Body**:
  ```json
  {
    "status_name": "string",
    "status_description": "string"
  }
  ```
- **Respuesta**: 201 Created

#### Actualizar Estado de Orden
- **PUT** `/api/order-statuses/admin?id=[id]`
- **Body**:
  ```json
  {
    "status_name": "string",
    "status_description": "string"
  }
  ```
- **Respuesta**: 200 OK

#### Eliminar Estado de Orden
- **DELETE** `/api/order-statuses/admin?id=[id]`
- **Respuesta**: 204 No Content

## Códigos de Error

- **400 Bad Request**: Error en la validación de datos
- **401 Unauthorized**: No autenticado
- **403 Forbidden**: No autorizado (requiere rol de administrador)
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor 