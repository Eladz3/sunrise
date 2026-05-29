export class ApiError extends Error {
  constructor(
    public status: number,
    public method: string,
    public path: string,
    public serverMessage: string,
    public code: string
  ) {
    super(`${method} ${path} → ${status} (${code}): ${serverMessage}`)
    this.name = 'ApiError'
  }
}

// Ring buffer of the last 5 successful API calls — used as context when logging errors
const BREADCRUMB_LIMIT = 5
const breadcrumbs: Array<{ method: string; path: string; status: number }> = []

export function addBreadcrumb(method: string, path: string, status: number) {
  if (breadcrumbs.length >= BREADCRUMB_LIMIT) breadcrumbs.shift()
  breadcrumbs.push({ method, path, status })
}

export async function parseErrorBody(response: Response): Promise<{ message: string; code: string }> {
  try {
    const body = await response.json()
    return {
      message: typeof body?.error === 'string' ? body.error : response.statusText,
      code: typeof body?.code === 'string' ? body.code : 'UNKNOWN',
    }
  } catch {
    return { message: response.statusText || 'Unknown error', code: 'UNKNOWN' }
  }
}

export async function throwApiError(response: Response, method: string, path: string): Promise<never> {
  const { message, code } = await parseErrorBody(response)
  const error = new ApiError(response.status, method, path, message, code)
  logApiError(error)
  throw error
}

function logApiError(error: ApiError) {
  const recent = breadcrumbs.map((b) => `${b.method} ${b.path} → ${b.status}`).join(', ')

  const isExpected = error.code === 'DOMAIN_NOT_FOUND' || error.code === 'DOMAIN_INVALID' || error.code === 'PERMISSION_DENIED'

  const log = isExpected ? console.warn : console.error
  log(`[API] ${error.method} ${error.path} → ${error.status} (${error.code})\n  server: "${error.serverMessage}"` + (recent ? `\n  recent: ${recent}` : ''))
}
