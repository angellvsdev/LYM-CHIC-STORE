# Sistema de Subida de Imágenes - LYM ChicStore

## Overview

Se ha implementado un sistema completo de subida de imágenes utilizando Cloudinary con las siguientes características:

- ✅ **Drag & Drop** intuitivo
- ✅ **Preview** de imágenes en tiempo real
- ✅ **Validación** de tipos y tamaños
- ✅ **Optimización** automática de imágenes
- ✅ **Soporte** para imágenes múltiples
- ✅ **Galerías** de imágenes
- ✅ **Manejo de errores** robusto
- ✅ **Loading states** informativos
- ✅ **Integración** con formularios existentes

## Configuración

### 1. Variables de Entorno

Agrega las siguientes variables a tu archivo `.env`:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset  # Opcional
```

### 2. Dependencias

Las siguientes dependencias ya están configuradas en el proyecto:

- `next-cloudinary` - Integración con Next.js
- `cloudinary` - SDK de Cloudinary
- `@types/multer` - Tipos para manejo de archivos

## Componentes

### 1. ImageUpload

Componente básico para subida de imagen única:

```tsx
import ImageUpload from '@/app/components/common/ImageUpload';

<ImageUpload
  onImageUpload={(image) => console.log('Uploaded:', image)}
  onImageRemove={() => console.log('Removed')}
  currentImage="/path/to/current/image.jpg"
  maxSize={5}
  className="w-full"
/>
```

**Props:**
- `onImageUpload`: Callback cuando se sube una imagen
- `onImageRemove`: Callback cuando se elimina una imagen
- `currentImage`: URL de imagen actual (para edición)
- `maxSize`: Tamaño máximo en MB (default: 5)
- `acceptedTypes`: Array de tipos MIME permitidos
- `className`: Clases CSS adicionales

### 2. ImageGallery

Componente avanzado para múltiples imágenes:

```tsx
import ImageGallery from '@/app/components/common/ImageGallery';

<ImageGallery
  images={images}
  onImagesChange={(images) => setImages(images)}
  maxImages={10}
  allowMultiple={true}
  showPreview={true}
/>
```

**Props:**
- `images`: Array de imágenes subidas
- `onImagesChange`: Callback cuando cambia el array de imágenes
- `maxImages`: Número máximo de imágenes (default: 10)
- `allowMultiple`: Permite múltiples archivos (default: true)
- `showPreview`: Muestra vista previa (default: true)
- `maxSize`: Tamaño máximo por archivo en MB (default: 5)

### 3. useImageUpload Hook

Hook personalizado para manejar subidas:

```tsx
import { useImageUpload } from '@/hooks/useImageUpload';

const {
  isUploading,
  progress,
  error,
  uploadedImages,
  uploadFile,
  uploadMultipleFiles,
  removeImage,
  clearImages,
  clearError,
  reset
} = useImageUpload({
  maxSize: 5,
  acceptedTypes: ['image/jpeg', 'image/png'],
  onSuccess: (image) => console.log('Success:', image),
  onError: (error) => console.error('Error:', error),
});
```

## API Endpoint

### POST /api/upload

Endpoint para subir imágenes:

**Request:**
- Method: `POST`
- Body: `FormData` con campo `file`
- Content-Type: `multipart/form-data`

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "lym-chicstore/...",
    "width": 1200,
    "height": 800,
    "format": "jpg",
    "size": 245760
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "File too large. Maximum size is 5MB."
}
```

### DELETE /api/upload

Endpoint para eliminar imágenes:

**Request:**
- Method: `DELETE`
- Query Param: `publicId` - ID público de la imagen

**Response:**
```json
{
  "success": true,
  "data": { "result": "ok" }
}
```

## Integración con Formularios

### Productos

Los formularios de productos ya están integrados con el nuevo sistema:

- **ProductFormModal**: Utiliza `ImageUpload` para imagen principal
- Soporte para imagen individual con validación
- Preview automática de la imagen actual

### Categorías

Los formularios de categorías también están actualizados:

- **CategoryFormModal**: Utiliza `ImageUpload` para imagen de categoría
- Manejo de imagen actual al editar
- Validación automática

## Características Técnicas

### Optimización Automática

Las imágenes se optimizan automáticamente en Cloudinary:

- **Compresión inteligente**: `quality: auto`
- **Formato automático**: `fetch_format: auto`
- **Redimensionamiento**: Máximo 1200x1200px
- **Cropping inteligente**: `crop: limit`

### Validaciones

- **Tipos de archivo**: JPEG, PNG, WebP, GIF
- **Tamaño máximo**: 5MB por archivo (configurable)
- **Dimensiones**: Validación automática de ancho/alto
- **Seguridad**: Validación de tipos MIME

### Manejo de Errores

- **Validación cliente**: Antes de subir
- **Validación servidor**: Doble verificación
- **Mensajes claros**: Error específicos y accionables
- **Recuperación**: Estado de error limpiable

### UX/UI

- **Drag & Drop**: Arrastrar y soltar archivos
- **Progreso**: Barra de progreso real
- **Preview**: Vista previa instantánea
- **Responsive**: Adaptado a móviles y desktop
- **Accesibilidad**: Navegación por teclado y screen readers

## Ejemplos de Uso

### Subida Simple

```tsx
const ProductForm = () => {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <ImageUpload
      onImageUpload={(image) => setImageUrl(image.url)}
      onImageRemove={() => setImageUrl('')}
      currentImage={imageUrl}
    />
  );
};
```

### Galería de Imágenes

```tsx
const ProductGallery = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);

  return (
    <ImageGallery
      images={images}
      onImagesChange={setImages}
      maxImages={5}
      allowMultiple={true}
    />
  );
};
```

### Hook Personalizado

```tsx
const CustomUploader = () => {
  const { isUploading, uploadFile, error } = useImageUpload({
    onSuccess: (image) => {
      toast.success('¡Imagen subida exitosamente!');
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadFile(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} disabled={isUploading} />
      {isUploading && <div>Subiendo...</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};
```

## Consideraciones de Seguridad

1. **Variables de entorno**: Nunca exponer `CLOUDINARY_API_SECRET` en el cliente
2. **Validación de tipos**: Siempre validar tipos MIME en servidor
3. **Límites de tamaño**: Configurar límites apropiados según el caso de uso
4. **Sanitización**: Los nombres de archivo se sanitizan automáticamente
5. **Permisos**: Configurar permisos adecuados en Cloudinary

## Performance

- **Lazy loading**: Las imágenes utilizan Next.js Image con lazy loading
- **Optimización**: Formatos modernos (WebP, AVIF) cuando sea posible
- **Caching**: Cloudinary proporciona CDN global
- **Compresión**: Balance automático entre calidad y tamaño

## Troubleshooting

### Error: "Invalid file type"
- Verifica que el archivo sea JPEG, PNG, WebP o GIF
- Revisa las extensiones de archivo permitidas

### Error: "File too large"
- Reduce el tamaño del archivo a menos de 5MB
- Considera usar herramientas de compresión

### Error: "Upload failed"
- Verifica la conexión a internet
- Revisa las variables de entorno de Cloudinary
- Revisa la consola para errores detallados

### Imágenes no se muestran
- Verifica las URLs de Cloudinary
- Revisa la configuración de CORS en Cloudinary
- Confirma las variables de entorno

## Soporte

Para cualquier problema o pregunta sobre el sistema de imágenes:

1. Revisa este documento
2. Consulta la consola del navegador para errores
3. Verifica las variables de entorno
4. Revisa la configuración de Cloudinary

---

**Última actualización**: Febrero 2026
**Versión**: 1.0.0
