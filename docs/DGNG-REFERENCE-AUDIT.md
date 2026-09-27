# Auditoría de referencia DGNG Store

Fecha: 2026-09-26. Fuente inspeccionada en modo de solo lectura: `C:\Users\User\commerce-builder`.

## Alcance revisado

Se revisaron `package.json`, árbol completo de `src`, routing, tipos, stores Zustand, repositorios Firebase, autenticación, Admin, dashboard, catálogo, inventario, pedidos, clientes, configuración, checkout, proyección pública, métricas financieras y de negocio, proyección, analítica, tests, `firestore.rules`, `vercel.json` y configuración TypeScript/Vite. No se ejecutaron instalaciones, scripts ni escrituras en DGNG.

## Arquitectura encontrada

DGNG es una SPA React/Vite/TypeScript con React Router, Zustand y Firebase. La UI pública y Admin comparten el mismo router. Los tipos viven en `src/types`; los stores de Zustand concentran estado, validación, migración de datos locales y sincronización remota. Los repositorios Firebase escriben colecciones privadas (`products`, `orders`, `customers`, movimientos y configuración) y una colección `catalog` pública. El módulo de analítica usa funciones mayormente puras sobre productos, pedidos y ajustes de negocio. El Admin se estructura con layout, navegación lateral, topbar y páginas operativas.

## A. Reutilizar conceptualmente

- Una única fuente comercial con una proyección pública explícita.
- Snapshots de nombre, precio y costo dentro de cada pedido para conservar historia financiera.
- Política central de pedidos válidos para que finanzas y analítica reconcilien.
- Movimientos de inventario auditables, batches e idempotencia.
- Invariante de stock no negativo.
- StoreConfig con defaults locales y capacidad de configuración remota.
- Métricas de negocio como funciones puras independientes de React.
- Rutas anidadas con shells distintos para Storefront y Admin.
- Reglas deny-by-default y colecciones privadas OWNER.
- Tests de dominio para operaciones críticas y casos legacy.

## B. Adaptar para MG

- Separar dominio, puertos de repositorio, estado de aplicación y adaptadores de datos. En DGNG esas responsabilidades se mezclan dentro de stores.
- Enriquecer Product con variantes, imágenes, estados, SEO y relaciones por ID a categoría, marca, necesidad y colección.
- Separar disponibilidad pública booleana del balance exacto privado.
- Ampliar estados de pedido sin ligarlos todavía a un proveedor logístico.
- Dividir StoreConfig público de BusinessSettings privado.
- Configurar OWNER exclusivamente mediante entorno y reglas desplegadas para el Firebase propio.
- Mantener el carrito local, pero no usar localStorage como fuente de verdad para catálogo, pedidos o administración.
- Usar rutas por `slug` para producto público.
- Mantener la idea del Admin responsive, con jerarquía y densidad visual consistentes para MG.

## C. No arrastrar

- UID OWNER codificado en código fuente y reglas.
- Credenciales, `.env`, proyecto Firebase, nombres de colecciones o datos comerciales DGNG.
- Productos y categorías demo cargados como estado inicial persistente.
- Escritura/creación remota automática durante bootstraps.
- Dependencias de importación Excel y librerías de iconos duplicadas en Hito 0.
- Modelos planos con categoría y marca como texto libre.
- Costos, stock, validación, persistencia y sincronización remota dentro de un solo Zustand store.
- Guardas globales registradas de forma mutable entre stores.
- Supuestos específicos de productos, medios de pago, envío, claims, imágenes o identidad visual DGNG.

## Deuda y riesgos observados

El store de productos es un agregado grande con lógica de dominio y red. La persistencia local puede divergir de Firebase. El OWNER hard-coded dificulta ambientes y es un riesgo operativo. El StoreConfig público completo puede exponer campos futuros si no se separa por contrato. La creación pública de pedidos en reglas valida estructura, pero los totales enviados por cliente exigen verificación del lado confiable. Los repositorios y componentes incluyen normalización legacy específica que no pertenece a un proyecto nuevo. La aplicación inicia suscripciones remotas desde componentes bootstrap, dificultando pruebas y control de efectos.

## Diferencias necesarias para MG

MG parte sin datos comerciales, usa contratos explícitos público/privado, no conecta Firebase hasta recibir configuración real, y conserva lógica invocable fuera de React para un futuro GanoBot. El storefront adopta un sistema visual editorial wellness propio; el Admin comparte tokens base, no su lenguaje visual.
