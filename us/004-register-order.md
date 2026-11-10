## Registro de pedidos

## 1. Problema

ADMIN no puede guardar un pedido real desde la pantalla de escaneo: el carrito usa productos de ejemplo y el botón solo simula el registro. Se necesita resolver códigos contra el inventario del ADMIN, permitir líneas manuales y guardar el pedido con estado `PENDING` si se asocia a una cuenta, o `PAID` si no se selecciona una.

## 2. Puntos a resolver

- Crear una API protegida para resolver códigos y guardar pedidos con productos del inventario del ADMIN.
- Conectar el escaneo, mostrar en pantalla el error de código no encontrado y conservar el registro manual del carrito.
- Registrar el pedido con cuenta opcional, asignar el estado correspondiente y reflejar los pedidos asociados en el historial de la cuenta seleccionada.

## 3. Plan Tecnico

1. **API y persistencia de pedidos** → `server/src/routes/route.ts`, `server/src/routes/orders.route.ts` (nuevo), `server/src/controllers/orders.controller.ts` (nuevo), `server/src/services/orders.service.ts` (nuevo), `server/src/schemas/orders.schema.ts` (nuevo), `server/prisma/schema.prisma` y migración (nuevo): exponer consulta por código y creación transaccional, restringidas a `requireAdmin`; validar productos y cuenta del ADMIN y establecer `PENDING` cuando el pedido tenga cuenta, o `PAID` cuando no la tenga. Ajustar `ProductsOrder` para admitir productos manuales con nombre y precio históricos, asociados a su `Order` y por tanto al `admin_id` de esa orden, sin exigir `product_admin_id`.

2. **Escaneo y carrito** → `client/src/pages/ScanNewOrder.tsx`, `client/src/types/scan.type.ts`: reemplazar productos de ejemplo por escaneo/consulta del catálogo del ADMIN, añadir el producto encontrado al carrito y mostrar explícitamente el error si el código no existe; mantener el alta manual y sus validaciones.

3. **Registro e historial opcional** → `client/src/services/orders.service.ts` (nuevo), `client/src/hooks/useOrders.ts` (nuevo), `client/src/pages/ScanNewOrder.tsx` y `server/src/services/accounts.service.ts`: enviar el carrito y la cuenta opcional para crear el pedido con estado `PENDING` si se seleccionó cuenta o `PAID` si se registró sin cuenta; mostrar estados de envío/error/éxito e invalidar el historial de la cuenta cuando corresponda.

## 4. Riesgos / inconsistencias

- El modelo debe distinguir productos manuales de productos del inventario, manteniendo cada línea manual asociada a la orden y al ADMIN dueño de esa orden; el cambio requiere migración de base de datos.
