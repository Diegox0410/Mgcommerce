interface ApiRequest {
  method?: string
}

interface ApiResponse {
  statusCode: number
  setHeader(name: string, value: string): void
  end(body?: string): void
}

const requireEnvironment = (name: string) => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Server configuration missing: ${name}`)
  return value
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== 'GET') {
    response.statusCode = 405
    response.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  try {
    const origin = requireEnvironment('CHOPIFY_BASE_URL').replace(/\/$/, '')
    const upstream = await fetch(`${origin}/api/catalog?tenant=tenant-mg`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10_000),
    })

    if (!upstream.ok) {
      throw new Error(`Catalog upstream failed (${upstream.status})`)
    }

    const catalog: unknown = await upstream.json()

    if (!Array.isArray(catalog)) {
      throw new Error('Chopify returned an invalid catalog')
    }

    response.statusCode = 200
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    response.end(JSON.stringify(catalog))
  } catch (error) {
    console.error(
      'MG catalog proxy:',
      error instanceof Error ? error.message : 'unknown',
    )

    response.statusCode = 502
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.setHeader('Cache-Control', 'no-store')
    response.end(JSON.stringify({
      error: 'El catalogo no esta disponible temporalmente.',
    }))
  }
}
