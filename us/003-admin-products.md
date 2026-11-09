## 1. Problema

El inventario usa productos de ejemplo y sus formularios no guardan cambios. ADMIN necesita registrar productos y consultar su catálogo paginado con búsqueda por código o nombre, además de editar precio y stock.

## 2. Puntos a resolver

- Implementar operaciones autenticadas por ADMIN para registrar, buscar y paginar sus productos.
- Conectar inventario y registro de producto con datos reales, búsqueda y paginación.
- Permitir actualizar precio y stock del producto del ADMIN y reflejar los cambios en el inventario.

## 3. Plan Tecnico

1. **API de productos** → `server/src/schemas/products.schema.ts` (nuevo), `server/src/services/products.service.ts` (nuevo), `server/src/controllers/products.controller.ts` (nuevo), `server/src/routes/products.route.ts` (nuevo) y `server/src/routes/route.ts`: usar `requireAdmin`; guardar código y nombre en `Product`, reutilizar el producto global existente si coincide el código y crear la asociación y datos propios del ADMIN en `ProductsAdmin`; implementar listado paginado/buscable y actualización de precio/stock limitados al ADMIN.

2. **Listado y alta** → `client/src/types/inventory.type.ts`, `client/src/services/products.service.ts` (nuevo), `client/src/hooks/useProducts.ts` (nuevo), `client/src/pages/Inventory.tsx` y `client/src/pages/ScanNewProduct.tsx`: consumir la API, conectar el formulario de alta, añadir búsqueda con reinicio de página, mostrar resultados y estados de carga/error/vacío, y paginar con los metadatos del servidor.

3. **Edición de producto** → `client/src/components/UpdateProduct.tsx` y `client/src/components/ProductCard.tsx`: enviar precio y stock al endpoint del producto asociado al ADMIN, validar los valores y refrescar los datos del listado después de guardar.

## 4. Riesgos / inconsistencias

- Si el código ya existe globalmente, reutilizar su nombre canónico en `Product` y evitar una segunda asociación `ProductsAdmin` para el mismo ADMIN.
