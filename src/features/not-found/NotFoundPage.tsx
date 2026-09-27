import { Link } from 'react-router-dom'

export function NotFoundPage() { return <section className="page container"><div className="empty-state"><span className="eyebrow">404</span><h1>Esta página no está aquí.</h1><Link to="/">Volver al inicio</Link></div></section> }
