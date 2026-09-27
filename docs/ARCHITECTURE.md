# Arquitectura MG

## Capas

1. **UI**: `components` y `features`. Renderiza y recoge interacción; no contiene reglas comerciales.
2. **Aplicación/estado**: `stores`. Coordina estados efímeros o cachés y recibe loaders explícitos.
3. **Dominio**: `domain`. Tipos, invariantes, cálculos y proyecciones puras, sin React ni Firebase.
4. **Datos/persistencia**: `repositories` define puertos; `services/firebase` prepara el adaptador y Auth.

El flujo objetivo es Admin → casos de uso/puertos → persistencia privada → proyección pública → Storefront. GanoBot podrá usar los mismos casos de uso y repositorios sin importar componentes React.

## Decisiones

- `StoreConfig` tiene defaults locales y no se persiste automáticamente.
- Firebase usa inicialización perezosa y falla de forma explícita si no está configurado.
- Solo carrito se persiste localmente; no es fuente de verdad comercial.
- El Admin usa una compuerta OWNER. Sin Firebase y `VITE_OWNER_UID`, muestra un estado seguro, no el panel.
- El catálogo público usa `PublicProduct`; costos, SKU internos y balances exactos no cruzan ese contrato.
- Firestore parte con deny-by-default. El placeholder de UID en reglas debe reemplazarse como parte del aprovisionamiento controlado, nunca desplegarse tal cual.
- No existen escrituras de Firebase. Hito 1 incorpora seis productos SAMPLE aislados y no persistidos detrás de `SamplePublicCatalogRepository`.
- Las rutas comerciales se cargan de forma diferida. Firebase/Auth conserva su chunk bajo demanda.
- `checkout-store` mantiene el `OrderDraft` completado solo en memoria; nunca persiste PII.

## Estructura

```text
src/
  app/              router y composición
  components/       UI base y layouts
  domain/           modelo y reglas puras
  features/         páginas por capacidad
  repositories/     interfaces de persistencia
  services/         adaptadores e integración
  stores/           estado de aplicación
  data/sample/      datos efímeros, explícitos y no persistidos
  styles/           tokens y lenguajes visuales
tests/               pruebas de dominio
```

## Próximos límites

Las mutaciones administrativas, transacciones de inventario, cálculo confiable de pedidos, creación real de órdenes y publicación de proyecciones pertenecen a Hitos 2–3.
