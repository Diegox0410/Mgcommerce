
import { Link } from 'react-router-dom'
import { useStoreConfigStore } from '../../stores/store-config-store'
import { MGLogo } from '../branding/MGLogo'

export function Footer() {
  const config = useStoreConfigStore((state) => state.config)

  const visibleGroups = config.footer.groups.filter(
    (group) => group.links.length > 0,
  )

  const hasContact = Boolean(
    config.contact.email ||
    config.contact.phone ||
    config.contact.city,
  )

  return (
    <footer className="site-footer mg-footer">

      {/* IDENTIDAD DE LA MARCA */}
      <div className="container footer__lead mg-footer__lead">
        <Link
          to="/"
          className="mg-footer__brand"
          aria-label="MG Salud y Belleza - Volver al inicio"
        >
          <MGLogo
            className="mg-footer__logo"
            size={220}
          />
        </Link>

        <div className="mg-footer__description">
          <span className="mg-footer__eyebrow">
            MG SALUD & BELLEZA
          </span>

          <h2>
            Cuidarte es nuestra
            <br />
            inspiración.
          </h2>

          <p>{config.footer.description}</p>
        </div>
      </div>

      {/* ENLACES Y CONTACTO */}
      <div className="container footer__grid mg-footer__grid">
        {visibleGroups.map((group) => (
          <div key={group.id}>
            <h2>{group.label}</h2>

            {group.links.map((link) => (
              <Link key={link.href} to={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}

        {hasContact && (
          <div>
            <h2>Contacto</h2>

            {config.contact.email && (
              <a href={`mailto:${config.contact.email}`}>
                {config.contact.email}
              </a>
            )}

            {config.contact.phone && (
              <span>{config.contact.phone}</span>
            )}

            {config.contact.city && (
              <span>{config.contact.city}</span>
            )}
          </div>
        )}

        <div>
          <h2>Ubicación</h2>
          <span>{config.contact.country}</span>
          <span>Moneda: USD</span>
        </div>
      </div>

      {/* INFORMACIÓN LEGAL */}
      <div className="container footer__bottom mg-footer__bottom">
        <span>
          © {new Date().getFullYear()} {config.footer.legalText}
        </span>

        <span>
          Belleza · Cuidado · Bienestar
        </span>
      </div>

    </footer>
  )
}
