
import {
  ArrowRight,
  CalendarDays,
  Instagram,
  Leaf,
  MessageCircle,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/use-page-meta'
import { useStoreConfigStore } from '../../stores/store-config-store'

const services = [
  {
    id: 'capilar',
    title: 'Cuidado capilar',
    description:
      'Tratamientos, recuperación y cuidado personalizado para tu cabello.',
    image:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1100&q=85',
    alt: 'Espacio profesional dedicado al cuidado capilar',
  },
  {
    id: 'facial',
    title: 'Cuidado facial',
    description:
      'Limpieza, hidratación y tratamientos especializados para tu piel.',
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1100&q=85',
    alt: 'Aplicación profesional de tratamiento facial',
  },
  {
    id: 'bienestar',
    title: 'Estética y bienestar',
    description:
      'Experiencias de belleza y bienestar pensadas especialmente para ti.',
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1100&q=85',
    alt: 'Ambiente tranquilo de bienestar y cuidado personal',
  },
]

export function HomePage() {
  const config = useStoreConfigStore((state) => state.config)

  usePageMeta(
    'Belleza, salud y bienestar integral',
    'Servicios profesionales de belleza y cuidado personal en MG Salud & Belleza.',
  )

  const instagram = config.social.instagram.trim()
  const instagramUrl = /^https:\/\/(www\.)?instagram\.com\//i.test(instagram)
    ? instagram
    : null

  const whatsappNumber = config.whatsapp.number.replace(/\D/g, '')

  const whatsappReady =
    config.whatsapp.enabled &&
    whatsappNumber.length >= 8 &&
    whatsappNumber.length <= 15

  const whatsappUrl = whatsappReady
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Hola, MG Salud & Belleza. Quisiera conocer sus servicios y solicitar una cita.',
      )}`
    : null

  return (
    <div className="mg-home">

      {/* HERO PRINCIPAL */}
      <section className="mg-hero" aria-labelledby="mg-hero-title">
        <div
          className="mg-hero__photo"
          role="img"
          aria-label="Fotografía editorial de belleza y cuidado personal"
        />

        <div className="mg-hero__shade" />

        <div className="container mg-hero__content">
          <div className="mg-hero__copy">
            <span className="mg-kicker">
              CUIDADO · ESTÉTICA · BIENESTAR
            </span>

            <h1 id="mg-hero-title">
              Belleza, salud y
              <br />
              <em>bienestar integral.</em>
            </h1>

            <p>
              Servicios de belleza y productos seleccionados
              para acompañarte en cada momento de tu cuidado.
            </p>

            <div className="mg-hero__actions">
              <Link
                className="mg-btn mg-btn--primary"
                to="/citas"
              >
                <CalendarDays size={19} />
                Agenda tu cita
              </Link>

              <Link
                className="mg-btn mg-btn--outline"
                to="/catalogo"
              >
                Explorar catálogo
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        <a href="#servicios" className="mg-hero__scroll">
          Descubre MG
          <span aria-hidden="true">↓</span>
        </a>
      </section>

      {/* PRESENTACIÓN */}
      <section className="mg-intro container">
        <span className="mg-kicker">
          TU ESPACIO DE BELLEZA
        </span>

        <h2>
          Un momento para ti.
          <br />
          <em>Un cuidado que se siente.</em>
        </h2>

        <p>
          Creemos en dedicar tiempo a lo que te hace sentir bien.
          Descubre nuestros servicios y encuentra el cuidado
          que buscas.
        </p>
      </section>

      {/* SERVICIOS */}
      <section className="mg-services" id="servicios">
        <div className="container">
          <div className="mg-section-heading">
            <div>
              <span className="mg-kicker">
                EXPERIENCIAS MG
              </span>
              <h2>Nuestros servicios</h2>
            </div>

            <p>
              Belleza y bienestar en un espacio pensado
              para tu cuidado personal.
            </p>
          </div>

          <div className="mg-services__grid">
            {services.map((service, index) => (
              <article className="mg-service" key={service.id}>
                <div className="mg-service__media">
                  <img
                    src={service.image}
                    alt={service.alt}
                    loading="lazy"
                  />

                  <span className="mg-service__number">
                    0{index + 1}
                  </span>
                </div>

                <div className="mg-service__body">
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>

                  <Link
                    className="mg-service__arrow"
                    to={`/citas?servicio=${service.id}`}
                    aria-label={`Solicitar cita de ${service.title}`}
                    title={`Solicitar cita de ${service.title}`}
                  >
                    <ArrowRight size={21} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link
              className="mg-text-link"
              to="/citas"
            >
              Solicitar una cita
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* HISTORIA DE MG */}
      <section className="mg-story" id="nosotros">
        <div className="mg-story__photo">
          <img
            src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1400&q=85"
            alt="Productos y tratamientos de cuidado personal"
            loading="lazy"
          />
        </div>

        <div className="mg-story__content">
          <Leaf size={28} strokeWidth={1.3} />

          <span className="mg-kicker">
            LA ESENCIA DE MG
          </span>

          <h2>
            Cuidarte también
            <br />
            es una forma de
            <br />
            <em>quererte.</em>
          </h2>

          <p>
            En MG Salud & Belleza reunimos servicios
            estéticos y una selección de productos
            para hacer del cuidado personal una
            experiencia cercana y especial.
          </p>

          <Link className="mg-text-link" to="/catalogo">
            Descubre nuestra selección
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* INVITACIÓN AL CATÁLOGO */}
      <section className="mg-catalog-teaser">
        <div className="container mg-catalog-teaser__inner">
          <div className="mg-catalog-teaser__icon">
            <Sparkles size={30} strokeWidth={1.4} />
          </div>

          <span className="mg-kicker">
            NUESTRA SELECCIÓN
          </span>

          <h2>
            Belleza que puedes
            <br />
            llevar contigo.
          </h2>

          <p>
            Explora nuestro catálogo de productos
            para el cuidado facial, capilar y corporal.
          </p>

          <Link
            className="mg-btn mg-btn--primary"
            to="/catalogo"
          >
            Visitar catálogo
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* CONTACTO Y AGENDAMIENTO */}
      <section className="mg-contact" id="citas">
        <div className="container mg-contact__inner">
          <div>
            <span className="mg-kicker">
              ESTAMOS PARA TI
            </span>

            <h2>
              Tu próximo momento
              <br />
              de cuidado comienza aquí.
            </h2>

            <p>
              Cuéntanos qué servicio necesitas y
              selecciona tu fecha preferida.
            </p>
          </div>

          <div className="mg-contact__actions">
            <Link
              className="mg-btn mg-btn--light"
              to="/citas"
            >
              <CalendarDays size={20} />
              Solicitar cita
            </Link>

            {whatsappUrl && (
              <a
                className="mg-social-link"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} />
                Hablar directamente por WhatsApp
              </a>
            )}

            {instagramUrl && (
              <a
                className="mg-social-link"
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={18} />
                Síguenos en Instagram
              </a>
            )}
          </div>
        </div>
      </section>

    </div>
  )
}
