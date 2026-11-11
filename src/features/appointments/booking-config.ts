
/**
 * MGcommerce — Configuración provisional de citas.
 *
 * Estos horarios son preferencias de solicitud.
 * NO representan disponibilidad real.
 */

export const bookingConfig = {
  timeZone: 'America/Guayaquil',

  // Cantidad de meses visibles, incluido el actual.
  monthsAhead: 3,

  // Horas orientativas, no confirmadas.
  preferredTimes: [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ],

  services: [
    {
      id: 'capilar',
      name: 'Cuidado capilar',
      description:
        'Tratamientos, recuperación y cuidado del cabello.',
    },
    {
      id: 'facial',
      name: 'Cuidado facial',
      description:
        'Limpieza, hidratación y tratamientos faciales.',
    },
    {
      id: 'bienestar',
      name: 'Estética y bienestar',
      description:
        'Servicios de belleza y cuidado personal.',
    },
    {
      id: 'asesoria',
      name: 'Asesoría personalizada',
      description:
        'Conoce qué tratamiento puede adaptarse a ti.',
    },
  ],
} as const

export function ecuadorNow() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: bookingConfig.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? ''

  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    time: `${get('hour')}:${get('minute')}`,
  }
}

export function dateKey(
  year: number,
  month: number,
  day: number,
) {
  return [
    year,
    String(month + 1).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('-')
}

export function formatBookingDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return 'Por seleccionar'
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return 'Fecha no válida'
  }

  return new Intl.DateTimeFormat('es-EC', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function monthName(date: Date) {
  const name = new Intl.DateTimeFormat('es-EC', {
    month: 'long',
    year: 'numeric',
  }).format(date)

  return name.charAt(0).toUpperCase() + name.slice(1)
}
