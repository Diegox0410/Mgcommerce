export interface StoreConfig {
  identity: {
    brandName: string
    shortName: string
    logoUrl: string
    faviconUrl: string
  }
  announcement: { enabled: boolean; text: string; href?: string }
  header: {
    navigation: Array<{ id: string; label: string; href: string; kind: 'link' | 'mega'; enabled: boolean }>
  }
  hero: {
    eyebrow: string
    title: string
    description: string
    primaryLabel: string
    primaryHref: string
    secondaryLabel: string
    secondaryHref: string
  }
  home: {
    sections: Array<{ id: 'concerns' | 'featured' | 'story' | 'categories' | 'new'; enabled: boolean; order: number }>
    concernsTitle: string
    featuredTitle: string
    newTitle: string
    story: { eyebrow: string; title: string; description: string; ctaLabel: string; ctaHref: string }
    newsletter: { enabled: boolean; title: string; description: string }
  }
  contact: { email: string; phone: string; city: string; country: string }
  whatsapp: { enabled: boolean; number: string; defaultMessage: string }
  social: { instagram: string; facebook: string; tiktok: string }
  seo: { title: string; description: string }
  footer: {
    legalText: string
    description: string
    groups: Array<{ id: string; label: string; links: Array<{ label: string; href: string }> }>
  }
  checkout: {
    mode: 'disabled' | 'sample' | 'live'
    enabledFields: Array<'name' | 'phone' | 'email' | 'address' | 'city' | 'reference'>
    paymentMethods: Array<{ id: string; label: string; enabled: boolean; sampleOnly?: boolean }>
  }
  appearance: { theme: 'mg-light' }
}

export const defaultStoreConfig: StoreConfig = {
  identity: { brandName: 'MG Salud y Belleza', shortName: 'MG', logoUrl: '', faviconUrl: '' },
  announcement: { enabled: false, text: '' },
  header: {
    navigation: [
      { id: 'new', label: 'Novedades', href: '/catalogo?coleccion=novedades', kind: 'link', enabled: true },
      { id: 'facial', label: 'Cuidado Facial', href: '/catalogo?categoria=facial', kind: 'mega', enabled: true },
      { id: 'hair', label: 'Cuidado Capilar', href: '/catalogo?categoria=capilar', kind: 'mega', enabled: true },
      { id: 'body', label: 'Cuerpo', href: '/catalogo?categoria=cuerpo', kind: 'link', enabled: true },
      { id: 'wellness', label: 'Bienestar', href: '/catalogo?categoria=bienestar', kind: 'mega', enabled: true },
      { id: 'supplements', label: 'Suplementos', href: '/catalogo?categoria=suplementos', kind: 'link', enabled: true },
    ],
  },
  hero: {
    eyebrow: 'MG SALUD & BELLEZA',
    title: 'Bienestar que se siente. Belleza que se nota.',
    description: 'Una selección de cuidado, belleza y bienestar para acompañar tu rutina.',
    primaryLabel: 'Descubrir productos',
    primaryHref: '/catalogo',
    secondaryLabel: 'Explorar categorías',
    secondaryHref: '/catalogo#categorias',
  },
  home: {
    sections: [
      { id: 'concerns', enabled: true, order: 1 },
      { id: 'featured', enabled: true, order: 2 },
      { id: 'story', enabled: true, order: 3 },
      { id: 'categories', enabled: true, order: 4 },
      { id: 'new', enabled: true, order: 5 },
    ],
    concernsTitle: 'Encuentra lo que buscas',
    featuredTitle: 'Selección MG',
    newTitle: 'Lo más nuevo',
    story: {
      eyebrow: 'Un momento para ti',
      title: 'Tu rutina. Tu bienestar. Tu MG.',
      description: 'Elige con calma, combina a tu manera y construye una rutina que se sienta propia.',
      ctaLabel: 'Explorar la selección',
      ctaHref: '/catalogo',
    },
    newsletter: { enabled: false, title: 'Notas de bienestar', description: 'Novedades y selecciones de MG.' },
  },
  contact: { email: '', phone: '', city: '', country: 'Ecuador' },
  whatsapp: { enabled: false, number: '', defaultMessage: '' },
  social: { instagram: '', facebook: '', tiktok: '' },
  seo: { title: 'MG Salud y Belleza', description: 'Bienestar y cuidado personal.' },
  footer: {
    legalText: 'MG Salud y Belleza',
    description: 'Cuidado, belleza y bienestar elegidos con intención.',
    groups: [
      { id: 'shop', label: 'Shop', links: [{ label: 'Catálogo', href: '/catalogo' }, { label: 'Novedades', href: '/catalogo?coleccion=novedades' }] },
      { id: 'mg', label: 'MG', links: [] },
      { id: 'help', label: 'Ayuda', links: [] },
      { id: 'legal', label: 'Legal', links: [] },
    ],
  },
  checkout: {
    mode: 'sample',
    enabledFields: ['name', 'phone', 'email', 'address', 'city', 'reference'],
    paymentMethods: [{ id: 'sample', label: 'Confirmación de demostración', enabled: true, sampleOnly: true }],
  },
  appearance: { theme: 'mg-light' },
}
