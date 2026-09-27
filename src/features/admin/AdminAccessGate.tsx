import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/FormControls'
import { isFirebaseConfigured } from '../../services/firebase/config'
import { resolveAdminAccess } from '../../services/auth/owner-access'

export function AdminAccessGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const firebaseReady = isFirebaseConfigured()

  useEffect(() => {
    if (!firebaseReady) { setReady(true); return }
    let unsubscribe: (() => void) | undefined
    void import('../../services/auth/auth-service').then(({ observeAuth }) => {
      unsubscribe = observeAuth((current) => { setUser(current); setReady(true) })
    }).catch(() => setReady(true))
    return () => unsubscribe?.()
  }, [firebaseReady])

  if (!ready) return <AdminMessage title="Verificando acceso" description="Validando la sesión OWNER…" />
  if (!firebaseReady || resolveAdminAccess(user).status === 'unconfigured') return <AdminMessage title="MG Admin está protegido" description="Configura el proyecto Firebase propio de MG y VITE_OWNER_UID para habilitar el acceso. No se han creado credenciales ni datos de prueba." />
  if (resolveAdminAccess(user).status === 'denied') return <AdminMessage title="Acceso no autorizado" description="Esta cuenta no corresponde al OWNER configurado." action={<Button onClick={() => void import('../../services/auth/auth-service').then(({ signOutOwner }) => signOutOwner())}>Cerrar sesión</Button>} />
  if (resolveAdminAccess(user).status === 'signed-out') {
    const submit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault(); setError('')
      const data = new FormData(event.currentTarget)
      try {
        const { signInOwner } = await import('../../services/auth/auth-service')
        await signInOwner(String(data.get('email')), String(data.get('password')))
      } catch { setError('No fue posible iniciar sesión.') }
    }
    return <div className="admin-auth"><form className="admin-auth__card" onSubmit={submit}><span className="eyebrow">MG Admin</span><h1>Acceso OWNER</h1><p>Ingresa con la cuenta autorizada para administrar la tienda.</p><Input id="email" name="email" label="Correo" type="email" autoComplete="username" required /><Input id="password" name="password" label="Contraseña" type="password" autoComplete="current-password" required />{error && <p role="alert" className="form-error">{error}</p>}<Button type="submit">Ingresar</Button></form></div>
  }
  return <>{children}</>
}

function AdminMessage({ title, description, action }: { title: string; description: string; action?: ReactNode }) { return <div className="admin-auth"><div className="admin-auth__card"><span className="eyebrow">MG Admin</span><h1>{title}</h1><p>{description}</p>{action}</div></div> }
