
interface ApiRequest {
  method?: string
}

interface ApiResponse {
  statusCode: number
  setHeader(name: string, value: string): void
  end(body?: string): void
}

export default function handler(
  request: ApiRequest,
  response: ApiResponse,
) {
  response.setHeader(
    'Content-Type',
    'application/json; charset=utf-8',
  )
  response.setHeader('Cache-Control', 'no-store')

  if (request.method !== 'GET') {
    response.statusCode = 405
    response.setHeader('Allow', 'GET')
    response.end(
      JSON.stringify({ error: 'Method not allowed' }),
    )
    return
  }

  const hasChopifyUrl = Boolean(
    process.env.CHOPIFY_BASE_URL?.trim(),
  )

  const hasChopifyToken = Boolean(
    process.env.CHOPIFY_COMMERCE_API_TOKEN?.trim(),
  )

  const chopifyConfigured =
    hasChopifyUrl && hasChopifyToken

  response.statusCode = 200

  response.end(
    JSON.stringify({
      service: 'mgcommerce',
      status: 'online',
      environment: process.env.VERCEL_ENV ?? 'local',
      integrations: {
        chopify: {
          configured: chopifyConfigured,
          status: chopifyConfigured
            ? 'configuration_present'
            : 'pending_configuration',
        },
      },
    }),
  )
}
