import { Link } from 'react-router-dom'
import { useStoreConfigStore } from '../../stores/store-config-store'

export function Footer() {
  const config = useStoreConfigStore((state) => state.config)
  const visibleGroups = config.footer.groups.filter((group) => group.links.length > 0)
  const hasContact = Boolean(config.contact.email || config.contact.phone || config.contact.city)
  return <footer className="site-footer"><div className="container footer__lead"><span className="wordmark wordmark--footer">{config.identity.shortName}</span><p>{config.footer.description}</p></div><div className="container footer__grid">{visibleGroups.map((group) => <div key={group.id}><h2>{group.label}</h2>{group.links.map((link) => <Link key={link.href} to={link.href}>{link.label}</Link>)}</div>)}{hasContact && <div><h2>Contacto</h2>{config.contact.email && <a href={`mailto:${config.contact.email}`}>{config.contact.email}</a>}{config.contact.phone && <span>{config.contact.phone}</span>}{config.contact.city && <span>{config.contact.city}</span>}</div>}<div><h2>País</h2><span>{config.contact.country}</span><span>USD</span></div></div><div className="container footer__bottom"><span>© {new Date().getFullYear()} {config.footer.legalText}</span><span>Storefront SAMPLE · Sin ventas reales</span></div></footer>
}
