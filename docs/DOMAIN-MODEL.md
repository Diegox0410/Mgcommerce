# Modelo de dominio

## Catálogo

`Product` relaciona entidades de taxonomía mediante IDs: `Category`, `Brand`, `Concern` y `Collection`. Contiene imágenes ordenadas, variantes con SKU y atributos, precios, costo privado, contenido opcional, estado, destacado y SEO. `PublicProduct` es un contrato separado: incluye referencias públicas de taxonomía y disponibilidad booleana, pero nunca SKU interno, costo o stock exacto.

## Inventario

`Inventory` mantiene disponible, reservado y mínimo por producto/variante. `InventoryMovement` conserva antes/después, delta, motivo, actor y batch. `applyInventoryDelta` rechaza fracciones y stock negativo. Los commits futuros deben ser transaccionales e idempotentes por batch.

## Pedidos

`OrderStatus` soporta nuevo, pendiente de pago, pago en revisión, pagado, preparación, listo, despachado, entregado y cancelado. `OrderSnapshot` guarda cliente, dirección, líneas, precio, costo, descuentos y totales al vender. Cambiar o borrar el producto vivo no altera el historial.

`OrderDraft` representa exclusivamente la captura previa del checkout. En modo SAMPLE permanece en memoria y no es un `Order`, no reserva inventario y no genera número comercial.

## Clientes, promociones y carrito

`Customer` contiene contacto, direcciones, etiquetas y notas privadas. `Promotion` define tipo, alcance y ventana sin implementar aún un motor completo. `Cart` usa líneas mínimas aptas para experiencia local; los precios deberán revalidarse al crear el pedido.

## Configuración

`StoreConfig` controla identidad, hero, announcement, contacto, WhatsApp, redes, SEO, footer y apariencia. `BusinessSettings` mantiene supuestos privados de país, moneda, zona horaria y futuros objetivos financieros.

## Analítica futura

Los snapshots permiten calcular ingresos netos, descuentos, costo, utilidad, margen, ticket, rendimiento por producto/categoría/marca/cliente y series temporales. El balance actual de inventario permanece separado del costo histórico vendido.
