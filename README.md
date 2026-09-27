# MG Salud y Belleza

Fundación técnica de un ecommerce premium para Ecuador con dos experiencias conectadas: Storefront público y MG Admin privado.

## Requisitos

- Node.js 22.12 o superior
- npm 10 o superior

## Inicio local

```bash
npm install
npm run dev
```

El Storefront funciona con un adaptador local async y seis productos `SAMPLE_DATA` no persistidos. Permite probar Home, catálogo, búsqueda, filtros, producto, variantes, carrito y checkout de demostración. Ninguna acción crea pedidos o pagos reales. `/admin` permanece protegido hasta configurar el Firebase propio de MG y `VITE_OWNER_UID`.

## Hito 1

- Storefront editorial responsive con navegación desktop, mega menú y drawer móvil.
- Catálogo con filtros, orden y query params.
- SearchOverlay local por producto, marca, categoría y necesidad.
- PDP con galería, variantes, cantidad, relacionados y carrito.
- Carrito versionado en localStorage únicamente como UX.
- Checkout SAMPLE con validación y `OrderDraft` solo en memoria de sesión.
- `/exito` exige un draft completado; navegación directa vuelve a un estado seguro.

## Variables

Copia `.env.example` a `.env.local` únicamente cuando existan credenciales reales del proyecto Firebase MG. No uses credenciales DGNG. Ningún documento remoto se crea automáticamente.

## Calidad

```bash
npm test
npm run lint
npm run build
```

Consulta `docs/ARCHITECTURE.md`, `docs/DOMAIN-MODEL.md`, `docs/DESIGN-SYSTEM.md`, `docs/DGNG-REFERENCE-AUDIT.md` y `docs/ROADMAP.md`.
