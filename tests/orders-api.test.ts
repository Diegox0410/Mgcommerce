import { afterEach, describe, expect, it, vi } from 'vitest'
import handler from '../api/orders'

type MockResponse = {
  statusCode: number
  headers: Record<string, string>
  body: string
  setHeader(name: string, value: string): void
  end(body?: string): void
}

const response = (): MockResponse => ({
  statusCode: 0,
  headers: {},
  body: '',
  setHeader(name, value) {
    this.headers[name] = value
  },
  end(body = '') {
    this.body = body
  },
})

const validRequest = () => ({
  method: 'POST',
  headers: {},
  body: {
    idempotencyKey: 'mg-checkout-1234567890',
    tenantId: 'tenant-floes',
    customer: {
      name: 'Cliente MG',
      phone: '+593999999999',
      email: 'cliente@example.com',
    },
    shipping: {
      city: 'Guayaquil',
      address: 'Direccion de prueba',
      reference: 'Referencia',
    },
    paymentMethod: 'transfer',
    lines: [{
      productId: 'mg-product-1',
      variantId: 'mg-variant-1',
      quantity: 2,
      price: 0.01,
      currency: 'FAKE',
      cost: 0,
      stock: 999999,
      tenantId: 'tenant-floes',
    }],
  },
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  delete process.env.CHOPIFY_BASE_URL
  delete process.env.CHOPIFY_COMMERCE_API_TOKEN
})

describe('MG orders API boundary', () => {
  it('rejects GET without an order id before calling Chopify', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const res = response()
    await handler(
      { method: 'GET', headers: {}, query: {} },
      res,
    )

    expect(res.statusCode).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects an empty order before calling Chopify', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const request = validRequest()
    request.body.lines = []

    const res = response()
    await handler(request, res)

    expect(res.statusCode).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('forces tenant-mg and strips browser commercial authority', async () => {
    process.env.CHOPIFY_BASE_URL = 'https://chopify.example'
    process.env.CHOPIFY_COMMERCE_API_TOKEN = 'server-secret'

    const calls: Array<{
      url: string
      init: RequestInit
      body: Record<string, unknown>
    }> = []

    const fetchMock = vi.fn(async (url: string | URL, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as Record<string, unknown>

      calls.push({
        url: String(url),
        init: init ?? {},
        body,
      })

      if (body.operation === 'resolveCustomerIdentity') {
        return new Response(JSON.stringify({
          ok: true,
          data: { customerId: 'customer-mg-1' },
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      if (body.operation === 'createOrderDraft') {
        return new Response(JSON.stringify({
          ok: true,
          data: { id: 'order-mg-1', status: 'draft' },
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({ error: 'unexpected operation' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    })

    vi.stubGlobal('fetch', fetchMock)

    const res = response()
    await handler(validRequest(), res)

    expect(res.statusCode).toBe(201)
    expect(calls).toHaveLength(2)

    for (const call of calls) {
      expect(call.url).toBe('https://chopify.example/api/commerce')

      const headers = call.init.headers as Record<string, string>
      expect(headers.Authorization).toBe('Bearer server-secret')
      expect(headers['X-Chopify-Tenant-Id']).toBe('tenant-mg')
    }

    expect(calls[0].body.operation).toBe('resolveCustomerIdentity')
    expect(calls[1].body.operation).toBe('createOrderDraft')

    const createInput = calls[1].body.input as {
      customerId: string
      lines: Array<Record<string, unknown>>
    }

    expect(createInput.customerId).toBe('customer-mg-1')
    expect(createInput.lines).toEqual([{
      productId: 'mg-product-1',
      variantId: 'mg-variant-1',
      quantity: 2,
    }])

    expect(createInput.lines[0]).not.toHaveProperty('price')
    expect(createInput.lines[0]).not.toHaveProperty('currency')
    expect(createInput.lines[0]).not.toHaveProperty('cost')
    expect(createInput.lines[0]).not.toHaveProperty('stock')
    expect(createInput.lines[0]).not.toHaveProperty('tenantId')

    expect(calls[1].body.idempotencyKey).toBe('mg-checkout-1234567890')

    const payload = JSON.parse(res.body)
    expect(payload.tenantId).toBe('tenant-mg')
  })

  it('maps a Chopify commercial rejection to 409', async () => {
    process.env.CHOPIFY_BASE_URL = 'https://chopify.example'
    process.env.CHOPIFY_COMMERCE_API_TOKEN = 'server-secret'

    const fetchMock = vi.fn(async (_url: string | URL, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as Record<string, unknown>

      if (body.operation === 'resolveCustomerIdentity') {
        return new Response(JSON.stringify({
          ok: true,
          data: { customerId: 'customer-mg-1' },
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({
        error: 'product pricing is not ready',
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      })
    })

    vi.stubGlobal('fetch', fetchMock)

    const res = response()
    await handler(validRequest(), res)

    expect(res.statusCode).toBe(409)

    const payload = JSON.parse(res.body)
    expect(payload.error).toContain('precio')
  })
})