# Firebase Foundation

## Tenant structure

El tenant actual se define una sola vez como `mg-salud-belleza`. Los datos comerciales privados viven bajo `tenants/{tenantId}` y sus subcolecciones. El storefront público usará documentos materializados separados bajo `publicTenants/{tenantId}`; nunca una lectura privada filtrada en cliente.

## Repositories and mappers

Los adapters implementan las interfaces de repositorio existentes detrás de Firestore. Los mappers puros convierten fechas ISO del dominio a `Date` y aceptan `Date`/`Timestamp` al reconstruir entidades. El dominio no importa Firebase y conserva centavos, basis points, snapshots, atribución y estados sin lógica adicional en persistencia.

## OWNER security

La UI compara `Firebase Auth user.uid` con `VITE_OWNER_UID`, pero esto solo controla experiencia de acceso. Firestore Rules son deny-by-default y protegen todos los documentos privados. Como Rules no puede leer variables Vite, contiene el UID Auth público del OWNER; el UID identifica una cuenta y no es una contraseña ni un secreto.

## Hito 2B.2

Quedan pendientes el flujo transaccional `OrderDraft → Order`, reservas de inventario, aprobación remota, publicación controlada de proyecciones, pruebas de Rules con Emulator Suite y conexión explícita de los repositorios a casos de uso. Este hito no realizó lecturas, escrituras, seeds ni migraciones remotas.
