/** Base URL without trailing slash, or empty string when using in-memory mock. */
export function apiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (typeof raw !== 'string') return ''
  const t = raw.trim()
  if (!t) return ''
  return t.replace(/\/+$/, '')
}

export function isRemoteWallet(): boolean {
  return apiBaseUrl() !== ''
}

type JsonRecord = Record<string, unknown>

export async function jsonFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const base = apiBaseUrl()
  const rel = path.startsWith('/') ? path : `/${path}`
  const url = `${base}${rel}`

  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(init?.headers || {}),
  }
  if (init?.body !== undefined && !(headers as JsonRecord)['Content-Type']) {
    ;(headers as Record<string, string>)['Content-Type'] = 'application/json'
  }

  const res = await fetch(url, { ...init, headers })
  const text = await res.text()
  let data: unknown = null
  if (text) {
    try {
      data = JSON.parse(text) as unknown
    } catch {
      data = null
    }
  }

  if (!res.ok) {
    const msg =
      typeof data === 'object' &&
      data !== null &&
      'error' in data &&
      typeof (data as JsonRecord).error === 'string'
        ? ((data as JsonRecord).error as string)
        : res.statusText || `HTTP ${res.status}`
    throw new Error(msg)
  }

  return data as T
}
