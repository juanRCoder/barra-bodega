## 1. Problema

Las pantallas de cuentas muestran datos de ejemplo y el servidor no expone operaciones para administrarlas. El rol ADMIN necesita listar y registrar sus cuentas, abrir una cuenta y consultar sus datos e historial reales.

## 2. Puntos a resolver

- Implementar endpoints autenticados para listar, registrar y consultar cuentas del ADMIN propietario.
- Conectar la lista y el formulario de nueva cuenta con la API, manteniendo filtros, totales y estados de solicitud.
- Sustituir los datos simulados del detalle por el perfil, saldo e historial persistidos de la cuenta.

## 3. Plan Tecnico

1. **API de cuentas** → `server/src/middleware/auth.middleware.ts` (nuevo), `server/src/services/accounts.service.ts` (nuevo), `server/src/controllers/accounts.controller.ts` (nuevo), `server/src/routes/accounts.route.ts` (nuevo) y `server/src/routes/route.ts`: verificar el access token y el rol ADMIN; implementar listado, creación y consulta por ID limitando cada operación a cuentas cuyo `admin_id` corresponda al usuario autenticado.

2. **Lista y registro** → `client/src/types/account.type.ts`, `client/src/services/accounts.service.ts` (nuevo), `client/src/hooks/useAccounts.ts` (nuevo), `client/src/pages/Accounts.tsx` y `client/src/components/NewAccount.tsx`: consumir listado y creación, reemplazar datos y cifras fijas, actualizar caché y mostrar errores y estados vacíos/cargando.

3. **Detalle de cuenta** → `client/src/pages/AccountDetail.tsx` y `server/src/services/accounts.service.ts`: consultar por el ID de la ruta y mostrar datos reales de contacto, saldo e historial de pedidos y pagos, contemplando carga, error y cuenta inexistente o no autorizada.

## 4. Riesgos / inconsistencias

- SUPER_ADMIN queda fuera del alcance; las operaciones de cuentas serán solo para ADMIN.
