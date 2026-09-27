# Commercial Core

## Order lifecycle

`OrderDraft` sigue siendo el borrador del checkout. `Order` es el registro comercial histórico y conserva ítems, precios, atribución y acuerdo vigentes como snapshots. Su máquina de estados solo permite `new → pending_payment → payment_review → paid → preparing → ready → dispatched → delivered`, con cancelación en las etapas permitidas. Pago y cumplimiento tienen estados separados para evitar que un único string represente procesos distintos.

## Payment verification

Un comprobante recibido cambia el pedido a revisión, pero no confirma dinero. La aprobación es una acción explícita; el rechazo devuelve el pedido a espera de pago. Los modelos no implementan carga de archivos ni proveedor de pagos.

## Attribution and management fee

La atribución registra canal, si la venta fue gestionada y si intervino automatización, una persona o ambos. La comisión usa basis points enteros sobre ingreso neto de productos (`subtotal - descuentos`). Envío e impuestos quedan excluidos.

## Conversation and escalation

`Conversation` describe el canal y modo de atención sin almacenar mensajes. `HumanEscalation` registra el motivo, prioridad y resolución de una intervención humana.

## Future GanoBot integration

Los contratos de application exponen futuras operaciones de catálogo, clientes, pedidos, comprobantes y escalación. Son puertos independientes de IA, HTTP, Firebase y WhatsApp; GanoBot será un consumidor y nunca la autoridad que confirme un pago.
