## 1. Problema

Las pantallas de registro e inicio de sesión todavía no consumen la API y el servidor no ofrece autenticación. Hace falta registrar e iniciar sesión como ADMIN, cerrar la sesión y renovar el access token cada 30 minutos.

## 2. Puntos a resolver

- Implementar el registro y login de ADMIN con validación y contraseñas protegidas.
- Gestionar sesiones persistentes, cierre de sesión y renovación de tokens cada 30 minutos.
- Exponer endpoints de autenticación e integrarlos al router existente.
- Conectar los formularios con react-hook-form y gestionar las mutaciones y la sesión con TanStack Query, eliminando el estado local de Login y Register.

## 3. Plan Técnico

1. **Registro y login de ADMIN** → `server/src/services/auth.service.ts`: validar datos, hashear contraseñas, asignar ADMIN y verificar credenciales.

2. **Tokens y sesiones** → `server/src/services/auth.service.ts`, `server/src/lib/auth-config.ts` y el modelo `Session` existente: firmar access tokens de 30 minutos y refresh tokens de 7 días usando las variables de `server/.env.example`; guardar hashes, rotar refresh y revocar al cerrar sesión.

3. **Endpoints** → `server/src/controllers/auth.controller.ts`, `server/src/routes/auth.route.ts`, `server/src/routes/route.ts` y `server/src/index.ts`: conectar registro, login, refresh y logout con cookie HttpOnly y errores JSON.

4. **Cliente** → `client/src/pages/Register.tsx`, `client/src/pages/Login.tsx`, `client/src/schemas/auth.schema.ts`, `client/src/services/auth.service.ts`, `client/src/hooks/useAuthSession.ts`, `client/src/auth/ProtectedRoute.tsx` y `client/src/components/Sidebar.tsx`: usar React Hook Form sin estado local para los formularios; TanStack Query para autenticación, proteger rutas y renovar el access token proactivamente al minuto 29 (vence al minuto 30).

## 4. Validación

- `pnpm --filter server build`
- `pnpm --filter client build`
- `pnpm --filter client lint` (permanece el warning existente de `client/src/components/ui/button.tsx`)
- `pnpm --filter server exec prisma validate`
- `pnpm exec prettier --check` sobre los archivos modificados
