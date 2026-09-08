# ReparoTuFuga

Landing y panel administrativo de ReparoTuFuga, construidos con Next.js 16.

## Configuración local

1. Usa Node.js 22 o posterior e instala dependencias con `pnpm install`.
2. Copia `.env.example` a `.env.local` y completa las variables necesarias.
3. Crea un proyecto en Supabase y ejecuta en su SQL Editor el archivo de `supabase/migrations/`.
4. Ejecuta `pnpm dev` y abre `http://localhost:3000/admin/login`.

La landing y Resend pueden funcionar antes de conectar las APIs de informes. El panel muestra “No disponible” para integraciones sin credenciales; no genera datos ficticios.

## Supabase y primer administrador

1. En Supabase abre **Authentication > Users > Add user** y crea al usuario con email y contraseña.
2. Copia su UUID y ejecuta en SQL Editor:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"role":"owner"}'::jsonb
where id = 'UUID_DEL_USUARIO';
```

También se admite `admin`. El rol está en `app_metadata`, que el usuario no puede editar. Cierra y vuelve a iniciar sesión para renovar el JWT. Configura `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` y `SUPABASE_SECRET_KEY`. La secret key es solo para servidor y jamás debe llevar el prefijo `NEXT_PUBLIC_`.

## Google Ads API

1. En una cuenta administradora de Google Ads solicita un developer token desde **Herramientas > Centro de API**.
2. En Google Cloud crea un proyecto, habilita **Google Ads API** y configura la pantalla de consentimiento OAuth.
3. Crea credenciales OAuth 2.0 y obtén un refresh token de un usuario con acceso a Ads usando el scope `https://www.googleapis.com/auth/adwords`.
4. Define `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_REFRESH_TOKEN` y `GOOGLE_ADS_CUSTOMER_ID` (sin guiones).
5. Si accedes mediante una cuenta administradora, agrega `GOOGLE_ADS_LOGIN_CUSTOMER_ID`. `GOOGLE_ADS_API_VERSION` es opcional (por defecto `v22`).

La integración es solo lectura, usa GAQL y cachea informes durante 10 minutos. Verifica que el developer token tenga acceso de producción y que el usuario OAuth tenga permisos sobre el customer ID.

## Vercel Web Analytics API

1. Activa Web Analytics en el proyecto y despliega una vez para comenzar a recopilar.
2. Crea un token en **Account Settings > Tokens** con acceso al proyecto/equipo.
3. Copia Project ID desde **Project Settings > General** y Team ID desde la configuración del equipo.
4. Define `VERCEL_TOKEN`, `VERCEL_PROJECT_ID` y, cuando corresponda, `VERCEL_TEAM_ID`.

Los eventos personalizados requieren un plan Vercel compatible. Bounce rate se omite porque la API integrada no aporta datos suficientes para calcularlo con rigor. Los resultados se cachean 10 minutos.

## Pruebas manuales

1. Envía una cotización desde `/?utm_source=google&utm_medium=cpc&utm_campaign=prueba&gclid=test-local`.
2. Confirma los correos, que la conversión Ads ocurre después del `200` y que el lead aparece en `/admin/leads`.
3. Cambia estado, nota y montos; recarga para confirmar persistencia.
4. Arrastra el lead en Kanban y confirma el cambio.
5. Accede a `/admin` y `/api/admin/google-ads` sin sesión: deben denegar el acceso.
6. Ejecuta `pnpm lint` y `pnpm build`.

## Seguridad y operación

- RLS protege `leads` y `lead_activity`; solo `admin`/`owner` pueden consultar o modificar.
- Google, Vercel, Resend y Supabase secret se usan exclusivamente en servidor.
- `/admin` se excluye de Vercel Analytics para no contaminar el tráfico público.
- Revoca inmediatamente cualquier clave Resend que haya estado escrita en el historial del repositorio.
- `/api/send-alert` requiere un `ALERT_API_SECRET` largo enviado como Bearer token.
