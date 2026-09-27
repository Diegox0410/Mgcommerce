# Design System MG

## Dirección

Wellness premium contemporáneo: editorial, calmado y con contraste. No replica DGNG, Squarespace, farmacia, SaaS ni una plantilla comercial genérica.

## Tokens

- Ink `#142019`: texto, acciones primarias y fondos oscuros.
- Ivory `#F6F2E8`: superficies cálidas.
- Porcelain `#FCFAF5`: fondo principal.
- Sage `#AAB8A3`: superficies naturales secundarias.
- Stone `#D8D2C5`: bordes discretos.
- Lime Accent `#D9F45B`: foco y acento mínimo; nunca una superficie dominante.

Los tokens de color, tipografía, espaciado, radios, sombras, contenedores, transición y z-index viven en `styles/tokens.css`.

## Tipografía

Display usa una pila serif editorial local basada en Iowan/Palatino/Georgia. Body/UI usa una pila sans moderna del sistema. Así no existe dependencia de red ni declaraciones dispersas.

## Componentes

La base incluye Button, IconButton, Input, Select, Textarea, Badge, Chip, Card, Dialog, Drawer, Sheet, Skeleton, EmptyState y LoadingState. Se mantienen pequeños y semánticos.

## Accesibilidad y responsive

Existen skip links, landmarks, labels, estados ARIA, foco visible, Escape en overlays, contraste y reducción de movimiento. Storefront y Admin contemplan 1440, 1280, 1024, 768, 430, 390 y 360 px. La navegación pública cambia a menú móvil; el sidebar Admin colapsa en escritorio y se convierte en drawer en móvil.

## Storefront Hito 1

La composición usa grandes áreas editoriales, mosaicos asimétricos, producto protagonista y placeholders cromáticos deliberados. Los placeholders conservan ratios reales y se reemplazarán por fotografía sin cambiar la estructura. El lime queda limitado a foco y pequeños indicadores.
