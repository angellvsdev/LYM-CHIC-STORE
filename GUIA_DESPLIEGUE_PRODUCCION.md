# Guía Definitiva de Despliegue a Producción (Zero Cost)
**L&M CHIC Store**

Esta guía detalla los pasos exactos para llevar tu proyecto a producción utilizando herramientas 100% gratuitas: **Vercel** para el hosting y dominio (`.vercel.app`), **Supabase** para la base de datos PostgreSQL, y **Resend / Nodemailer** para el envío de correos.

---

## 1. Preparación del Repositorio (GitHub)

Para mantener tu rama principal (`main`) con toda su documentación intacta pero lograr un despliegue sumamente limpio, crearemos una rama dedicada a producción (ej. `deploy`).

1. Asegúrate de estar en tu rama principal y tener todos tus cambios guardados, y luego crea y muévete a la nueva rama:
   ```bash
   git checkout -b deploy
   ```
2. Hemos configurado el archivo `.gitignore` para omitir la documentación interna (`*.md`). Sin embargo, como esos archivos ya estaban subidos a tu repositorio previamente, Git los sigue rastreando. Para eliminarlos del caché de Git **solo en esta rama de despliegue** (sin borrarlos de tu disco duro), ejecuta:
   ```bash
   git rm -r --cached "*.md"
   ```
   *(Nota: conservaremos `README.md` y `GUIA_DESPLIEGUE_PRODUCCION.md` que configuramos en el `.gitignore` como excepciones).*
3. Haz un commit y sube esta nueva rama limpia a GitHub:
   ```bash
   git add .
   git commit -m "Preparación limpia para despliegue en producción"
   git push -u origin deploy
   ```

---

## 2. Configuración de Base de Datos en Producción (Supabase)

Supabase ofrece una base de datos PostgreSQL gratuita perfecta para nuestro modelo "Zero Cost".

### Crear el Proyecto en Supabase
1. Ve a [Supabase](https://supabase.com/) y crea una cuenta o inicia sesión.
2. Haz clic en **"New Project"**.
3. Selecciona tu organización, dale un nombre al proyecto (ej. `lym-chicstore-prod`), genera una contraseña segura para la base de datos (¡guárdala bien!) y elige una región cercana a tus usuarios.
4. Haz clic en **"Create new project"** y espera unos minutos a que se aprovisione la base de datos.

### Obtener la URL de Conexión
1. En el panel de Supabase, ve a **Settings** (icono de engranaje) > **Database**.
2. Desplázate hasta la sección **Connection string** y selecciona **URI**.
3. Copia la URL de conexión. Debería verse similar a:
   `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`
4. Reemplaza `[YOUR-PASSWORD]` con la contraseña que generaste en el paso anterior. ¡Esta es tu **DATABASE_URL** para producción!

### Inicializar la Base de Datos
Antes de desplegar en Vercel, debemos crear las tablas y sembrar los datos iniciales (categorías y el usuario administrador) en tu nueva base de datos de producción.

1. En tu entorno local, cambia temporalmente tu archivo `.env` para apuntar a la nueva base de datos de Supabase:
   ```env
   DATABASE_URL="postgresql://postgres:tu_contraseña_segura@db.xyz.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
   ```

2. Ejecuta las migraciones para crear las tablas:
   ```bash
   npx prisma migrate deploy
   ```

3. Ejecuta el nuevo script de inicialización de producción (que creará 0 productos y 1 solo administrador):
   ```bash
   npm run db:seed:prod
   ```

Tu base de datos de Supabase ya está lista y configurada con tu usuario administrador: `lymchicstore@gmail.com` / `Lym_administration_321`.

---

## 3. Despliegue en Vercel y Emplear Dominio Gratuito

Vercel optimiza automáticamente los proyectos de Next.js y ofrece hosting gratuito con un subdominio `.vercel.app`.

1. Inicia sesión en [Vercel](https://vercel.com) (preferiblemente vinculando tu cuenta de GitHub).
2. Haz clic en **"Add New"** > **"Project"**.
3. Importa el repositorio de GitHub de `L&M CHIC Store`.
4. Deja la configuración por defecto de Framework Preset en **Next.js**.
5. **Importante:** En la configuración del proyecto en Vercel, busca la opción **"Production Branch"** (rama de producción) y cámbiala de `main` a `deploy`. Esto le dirá a Vercel que siempre despliegue los cambios de tu rama limpia.

### Configuración de Variables de Entorno (Environment Variables)
Antes de hacer clic en "Deploy", despliega la sección de **Environment Variables** y añade las siguientes:

*   **DATABASE_URL**: La URL de conexión de tu base de datos de producción en Supabase (la misma que usaste en el paso 2).
*   **NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME**: `df1sliccq`
*   **NEXT_PUBLIC_CLOUDINARY_API_KEY**: `697261398351222`
*   **CLOUDINARY_API_SECRET**: `1j5idrnh7gQQrezdu0lmCGrVsCE`
*   **RESEND_API_KEY**: Tu API Key de Resend en producción (`re_B3tm64Az_...`).
*   **RESEND_FROM_EMAIL**: `onboarding@resend.dev`
*   **BUSINESS_EMAIL**: `lymchicstore@gmail.com`
*   **FRONTEND_URL**: Al principio no sabrás la URL exacta, pero usualmente es `https://[nombre-proyecto].vercel.app`. Puedes revisar el dominio que Vercel te asigna luego del primer deploy y actualizar esta variable para que los enlaces de correo y validaciones dirijan correctamente a tu sitio.

5. Haz clic en **"Deploy"**.
6. Vercel comenzará a compilar el proyecto (esto tomará ~2 a 5 minutos).

---

## 4. Sobre el Envío de Correos y el "Zero Cost"

Como mantener una arquitectura estrictamente gratuita ("Zero Cost") implica **no comprar un dominio personalizado**, existen limitaciones importantes con servicios como Resend:

### Limitación de Resend sin Dominio Propio
Resend requiere verificar un dominio propio para enviar correos a cualquier persona. Como usarás el dominio gratuito de Vercel (`.vercel.app`), no podrás verificarlo en Resend.
En consecuencia, **Resend solo enviará correos a la dirección de correo con la que te registraste (lymchicstore@gmail.com)**. Ningún otro cliente recibirá correos de confirmación ni notificaciones.

### La Solución Gratuita: Nodemailer + Gmail
Para poder enviar notificaciones ilimitadas de pedidos, verificación de cuentas y cambios de estados **a todos los usuarios** sin necesidad de pagar por un dominio, la única vía 100% gratuita es migrar tu actual `EmailNotificationService.ts` para que utilice **Nodemailer** conectado a una cuenta de Gmail (ej. `lymchicstore@gmail.com`).

**Pasos resumidos si decides usar Nodemailer:**
1. Habilitar la "Verificación en 2 pasos" en tu cuenta de Google.
2. Generar una **Contraseña de Aplicación** (App Password) de 16 caracteres.
3. Instalar Nodemailer (`npm install nodemailer`).
4. Reemplazar la lógica de Resend usando el transporte SMTP de Gmail (`smtp.gmail.com`, puerto `465`).
5. Añadir `EMAIL_USER` (tu gmail) y `EMAIL_PASS` (tu App Password) a las variables de entorno de Vercel.

---

## 5. Lista Final de Verificación ✅

- [✅] La base de datos de producción en Supabase está inicializada con `lymchicstore@gmail.com` (contraseña: `Lym_administration_321`).
- [✅] El proyecto hizo build en Vercel sin errores bajo tu subdominio `.vercel.app`.
- [✅] Las variables de Cloudinary, Supabase y tu frontend URL están configuradas correctamente en Vercel.
- [✅] Eres consciente de las limitaciones de enviar correos con Resend sin dominio propio, y sabes que existe la alternativa de Nodemailer por SMTP si deseas enviar correos globales "Zero Cost".

**¡Felicidades! L&M CHIC Store está ahora completamente en internet sin generar gastos de infraestructura.**
