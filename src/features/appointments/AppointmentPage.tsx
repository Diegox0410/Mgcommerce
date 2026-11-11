
import { useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  MessageCircle,
  Sparkles,
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { usePageMeta } from '../../hooks/use-page-meta'
import { useStoreConfigStore } from '../../stores/store-config-store'
import {
  bookingConfig,
  dateKey,
  ecuadorNow,
  formatBookingDate,
  monthName,
} from './booking-config'

const weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

export function AppointmentPage() {
  const [searchParams] = useSearchParams()

  const requestedService = searchParams.get('servicio') ?? ''
  const validService = bookingConfig.services.some(
    (item) => item.id === requestedService,
  )

  const whatsapp = useStoreConfigStore(
    (state) => state.config.whatsapp,
  )

  const [service, setService] = useState(
    validService ? requestedService : '',
  )
  const [monthOffset, setMonthOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  usePageMeta(
    'Agenda tu cita',
    'Solicita una cita de belleza y bienestar en MG Salud & Belleza.',
  )

  const now = ecuadorNow()
  const [currentYear, currentMonth] = now.date
    .split('-')
    .map(Number)

  const visibleMonth = new Date(
    currentYear,
    currentMonth - 1 + monthOffset,
    1,
  )

  const lastVisibleMonth = new Date(
    currentYear,
    currentMonth - 1 + bookingConfig.monthsAhead - 1,
    1,
  )

  const lastDay = new Date(
    lastVisibleMonth.getFullYear(),
    lastVisibleMonth.getMonth() + 1,
    0,
  )

  const maxDate = dateKey(
    lastDay.getFullYear(),
    lastDay.getMonth(),
    lastDay.getDate(),
  )

  const firstWeekday = (visibleMonth.getDay() + 6) % 7

  const daysInMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0,
  ).getDate()

  const totalCells = Math.ceil(
    (firstWeekday + daysInMonth) / 7,
  ) * 7

  const calendarCells = Array.from(
    { length: totalCells },
    (_, index) => index - firstWeekday + 1,
  )

  const selectedService = bookingConfig.services.find(
    (item) => item.id === service,
  )

  const whatsappNumber = whatsapp.number.replace(/\D/g, '')

  const whatsappReady =
    whatsapp.enabled &&
    whatsappNumber.length >= 8 &&
    whatsappNumber.length <= 15

  const isPastTime = (time: string) =>
    selectedDate === now.date && time <= now.time

  const formattedDate = formatBookingDate(selectedDate)

  const message = [
    'Hola, MG Salud & Belleza.',
    '',
    '*SOLICITUD DE CITA*',
    '',
    `Servicio: ${selectedService?.name ?? 'Sin seleccionar'}`,
    `Fecha preferida: ${formattedDate}`,
    `Hora preferida: ${selectedTime || 'Sin seleccionar'}`,
    '',
    '*DATOS DE CONTACTO*',
    `Nombre: ${name.trim()}`,
    `Teléfono: ${phone.trim()}`,
    ...(notes.trim()
      ? ['', `Observaciones: ${notes.trim()}`]
      : []),
    '',
    '¿Podrían confirmar disponibilidad, duración y precio?',
    '',
    'Estado: Pendiente de confirmación',
    'Origen: MGcommerce / Citas web',
  ].join('\n')

  const selectDate = (value: string) => {
    setSelectedDate(value)
    setSelectedTime('')
    setCopied(false)
    setError('')
  }

  const changeMonth = (direction: number) => {
    const next = monthOffset + direction

    if (
      next < 0 ||
      next >= bookingConfig.monthsAhead
    ) {
      return
    }

    setMonthOffset(next)
  }

  const validate = () => {
    const current = ecuadorNow()

    if (!service || !selectedDate || !selectedTime) {
      setError('Selecciona un servicio, fecha y hora preferida.')
      return false
    }

    if (
      selectedDate < current.date ||
      selectedDate > maxDate
    ) {
      setError('Selecciona una fecha válida del calendario.')
      return false
    }

    if (
      !bookingConfig.preferredTimes.some(
        (item) => item === selectedTime,
      )
    ) {
      setError('Selecciona un horario válido.')
      return false
    }

    if (
      selectedDate === current.date &&
      selectedTime <= current.time
    ) {
      setError('El horario elegido ya pasó. Selecciona otro.')
      return false
    }

    if (name.trim().length < 2) {
      setError('Ingresa tu nombre y apellido.')
      return false
    }

    if (!/^[+\d\s()-]{7,20}$/.test(phone.trim())) {
      setError('Ingresa un teléfono de contacto válido.')
      return false
    }

    if (!consent) {
      setError('Debes aceptar compartir tus datos por WhatsApp.')
      return false
    }

    setError('')
    return true
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) return

    if (!whatsappReady) {
      setError(
        'WhatsApp aún no está configurado. Puedes copiar la solicitud.',
      )
      return
    }

    const url = `https://wa.me/${whatsappNumber}?text=${
      encodeURIComponent(message)
    }`

    window.location.assign(url)
  }

  const copyRequest = async () => {
    if (!validate()) return

    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
    } catch {
      setError('No fue posible copiar la solicitud.')
    }
  }

  return (
    <div className="mg-booking mg-booking--calendar">

      <section className="mg-booking__hero">
        <div className="container">
          <Link to="/" className="mg-booking__back">
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>

          <span className="mg-booking__eyebrow">
            MG SALUD & BELLEZA
          </span>

          <h1>
            Reserva un momento
            <br />
            <em>para ti.</em>
          </h1>

          <p>
            Elige el servicio y el momento que prefieras.
            Nuestro equipo confirmará posteriormente
            la disponibilidad de tu cita.
          </p>
        </div>
      </section>

      <div className="container mg-booking__layout">
        <form className="mg-booking__form" onSubmit={submit}>

          {/* SERVICIO */}
          <section className="mg-booking__section">
            <div className="mg-booking__heading">
              <span>01</span>
              <div>
                <h2>Elige tu experiencia</h2>
                <p>Selecciona el cuidado que necesitas.</p>
              </div>
            </div>

            <div className="mg-booking__services">
              {bookingConfig.services.map((item) => (
                <label
                  key={item.id}
                  className={`mg-booking__service ${
                    service === item.id ? 'is-selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="service"
                    value={item.id}
                    checked={service === item.id}
                    onChange={() => {
                      setService(item.id)
                      setCopied(false)
                    }}
                  />

                  <span className="mg-booking__service-copy">
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                  </span>

                  <span className="mg-booking__check">
                    {service === item.id && <Check size={15} />}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* CALENDARIO */}
          <section className="mg-booking__section">
            <div className="mg-booking__heading">
              <span>02</span>
              <div>
                <h2>Fecha y horario</h2>
                <p>Escoge tu fecha preferida.</p>
              </div>
            </div>

            <div className="mg-calendar">
              <div className="mg-calendar__top">
                <div>
                  <span className="mg-calendar__eyebrow">
                    CALENDARIO DE CITAS
                  </span>
                  <h3>{monthName(visibleMonth)}</h3>
                </div>

                <div className="mg-calendar__arrows">
                  <button
                    type="button"
                    aria-label="Mes anterior"
                    disabled={monthOffset === 0}
                    onClick={() => changeMonth(-1)}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    aria-label="Mes siguiente"
                    disabled={
                      monthOffset >= bookingConfig.monthsAhead - 1
                    }
                    onClick={() => changeMonth(1)}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="mg-calendar__grid">
                {weekdays.map((day, index) => (
                  <div
                    key={index}
                    className="mg-calendar__weekday"
                    aria-hidden="true"
                  >
                    {day}
                  </div>
                ))}

                {calendarCells.map((day, index) => {
                  if (day < 1 || day > daysInMonth) {
                    return (
                      <span
                        key={`empty-${index}`}
                        className="mg-calendar__empty"
                      />
                    )
                  }

                  const value = dateKey(
                    visibleMonth.getFullYear(),
                    visibleMonth.getMonth(),
                    day,
                  )

                  const past = value < now.date
                  const active = selectedDate === value
                  const today = value === now.date

                  return (
                    <button
                      key={value}
                      type="button"
                      className={[
                        'mg-calendar__day',
                        active ? 'is-selected' : '',
                        today ? 'is-today' : '',
                      ].join(' ')}
                      disabled={past}
                      aria-pressed={active}
                      aria-label={formatBookingDate(value)}
                      onClick={() => selectDate(value)}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>

              <div className="mg-calendar__legend">
                <span>
                  <i className="mg-calendar__legend-selected" />
                  Seleccionado
                </span>
                <span>
                  <i className="mg-calendar__legend-past" />
                  Fecha pasada
                </span>
              </div>
            </div>

            <div className="mg-calendar__times">
              <div className="mg-calendar__time-heading">
                <Clock3 size={19} />
                <div>
                  <strong>Hora preferida</strong>
                  <small>
                    {selectedDate
                      ? formattedDate
                      : 'Selecciona primero una fecha'}
                  </small>
                </div>
              </div>

              <div className="mg-booking__time-grid">
                {bookingConfig.preferredTimes.map((item) => {
                  const disabled =
                    !selectedDate || isPastTime(item)

                  return (
                    <button
                      type="button"
                      key={item}
                      disabled={disabled}
                      className={
                        selectedTime === item ? 'is-selected' : ''
                      }
                      aria-pressed={selectedTime === item}
                      onClick={() => {
                        setSelectedTime(item)
                        setCopied(false)
                        setError('')
                      }}
                    >
                      {item}
                    </button>
                  )
                })}
              </div>

              <p className="mg-calendar__disclaimer">
                Los horarios mostrados son preferencias
                orientativas, no disponibilidad en tiempo real.
                La cita requiere confirmación.
              </p>
            </div>
          </section>

          {/* CLIENTA */}
          <section className="mg-booking__section">
            <div className="mg-booking__heading">
              <span>03</span>
              <div>
                <h2>Datos de contacto</h2>
                <p>¿Con quién podemos comunicarnos?</p>
              </div>
            </div>

            <div className="mg-booking__fields">
              <label className="mg-booking__label">
                <span>Nombre y apellido *</span>
                <input
                  type="text"
                  required
                  value={name}
                  maxLength={120}
                  autoComplete="name"
                  placeholder="Tu nombre completo"
                  onChange={(event) => {
                    setName(event.target.value)
                    setCopied(false)
                  }}
                />
              </label>

              <label className="mg-booking__label">
                <span>WhatsApp de contacto *</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  maxLength={20}
                  autoComplete="tel"
                  placeholder="Tu número de teléfono"
                  onChange={(event) => {
                    setPhone(event.target.value)
                    setCopied(false)
                  }}
                />
              </label>

              <label className="mg-booking__label mg-booking__wide">
                <span>Observaciones (opcional)</span>
                <textarea
                  rows={4}
                  maxLength={400}
                  value={notes}
                  placeholder="¿Qué te gustaría que sepamos antes de tu cita?"
                  onChange={(event) => {
                    setNotes(event.target.value)
                    setCopied(false)
                  }}
                />
              </label>
            </div>

            <label className="mg-booking__consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) =>
                  setConsent(event.target.checked)
                }
              />
              <span>
                Acepto compartir mis datos por WhatsApp para
                gestionar esta solicitud de cita.
              </span>
            </label>
          </section>

          {error && (
            <p className="mg-booking__error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mg-booking__submit"
            disabled={!whatsappReady}
          >
            <MessageCircle size={20} />
            Enviar solicitud por WhatsApp
          </button>

          {!whatsappReady && (
            <p className="mg-booking__notice">
              El número oficial de WhatsApp está pendiente
              de configuración. Puedes copiar tu solicitud
              desde el resumen.
            </p>
          )}

          <p className="mg-booking__legal">
            Seleccionar una fecha no reserva un espacio.
            La solicitud deberá ser confirmada por MG.
          </p>
        </form>

        {/* RESUMEN */}
        <aside className="mg-booking__summary">
          <div className="mg-booking__summary-inner">
            <Sparkles size={24} strokeWidth={1.4} />

            <span className="mg-booking__eyebrow">
              RESUMEN DE TU SOLICITUD
            </span>

            <h2>
              Un espacio
              <br />
              para ti.
            </h2>

            <dl>
              <div>
                <dt>Servicio</dt>
                <dd>{selectedService?.name ?? 'Por elegir'}</dd>
              </div>
              <div>
                <dt>Fecha</dt>
                <dd>{formattedDate}</dd>
              </div>
              <div>
                <dt>Hora</dt>
                <dd>{selectedTime || 'Por elegir'}</dd>
              </div>
              <div>
                <dt>Nombre</dt>
                <dd>{name.trim() || 'Por completar'}</dd>
              </div>
              <div>
                <dt>Teléfono</dt>
                <dd>{phone.trim() || 'Por completar'}</dd>
              </div>
            </dl>

            <div className="mg-booking__summary-note">
              <CalendarDays size={21} />
              <p>
                Te ayudaremos a confirmar la disponibilidad,
                duración y detalles de tu tratamiento.
              </p>
            </div>

            <button
              type="button"
              className="mg-booking__copy"
              onClick={() => void copyRequest()}
            >
              {copied ? <Check size={17} /> : <Copy size={17} />}
              {copied ? 'Solicitud copiada' : 'Copiar solicitud'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
