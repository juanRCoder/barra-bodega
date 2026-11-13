## 1. Problema

El ADMIN no ve indicadores basados en sus pedidos: dinero recaudado, ventas totales, producto más pedido ni el top 3 por periodo. El Dashboard y Más vendidos muestran valores de ejemplo o vacíos, sin consulta de analítica.

## 2. Puntos a resolver

- Exponer analítica protegida y aislada por ADMIN, con periodos de hoy, últimos 7 días y mes calendario.
- Calcular recaudación, ventas totales y productos más pedidos sin mezclar pedidos anulados ni contar dos veces pagos de cuentas.
- Conectar el Dashboard a la analítica para mostrar indicadores y top 3 según el periodo elegido.
- Sustituir los datos simulados de Más vendidos por el ranking real correspondiente al periodo.

## 3. Plan Tecnico

1. **Consulta de analítica** → `server/src/routes/orders.route.ts`, `server/src/controllers/orders.controller.ts`, `server/src/services/orders.service.ts` y `server/src/schemas/orders.schema.ts`: añadir un endpoint validado y protegido por `requireAdmin` que limite las fechas al periodo solicitado y agrupe los pedidos y pagos del ADMIN autenticado.

2. **Reglas y agregaciones** → `server/src/services/orders.service.ts`, `server/prisma/schema.prisma`: calcular pedidos no anulados y cantidades por producto, incluyendo líneas manuales; contar como recaudación las órdenes sin cuenta y los pagos registrados de cuentas, sin incluir como cobrado el saldo de órdenes asociadas a una cuenta.

3. **Datos del Dashboard** → `client/src/pages/Dashboard.tsx`, `client/src/services/orders.service.ts`, `client/src/hooks/useOrders.ts` y `client/src/types/order.type.ts`: consultar por periodo y mostrar dinero recaudado, ventas totales, producto más pedido y top 3, con estados de carga, error y ausencia de datos.

4. **Ranking por periodo** → `client/src/pages/BestSellers.tsx`, `client/src/services/orders.service.ts`, `client/src/hooks/useOrders.ts` y `client/src/types/order.type.ts`: reemplazar productos de ejemplo por resultados reales y actualizar el ranking al cambiar entre hoy, últimos 7 días y mes calendario.

## 4. Riesgos / inconsistencias

- `AccountPayment` se asocia a la cuenta, no a una orden específica; para recaudación por periodo se debe usar la fecha del pago y no atribuirlo a una orden individual.
