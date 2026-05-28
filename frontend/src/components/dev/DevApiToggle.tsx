import { useState } from 'react'
import { setApiEnv, API_URLS } from '@/api/client'

type ApiEnv = 'prod' | 'local'

function currentEnv(): ApiEnv {
  return localStorage.getItem('api_env') === 'local' ? 'local' : 'prod'
}

export function DevApiToggle() {
  const [env, setEnv] = useState<ApiEnv>(currentEnv)

  function toggle() {
    const next: ApiEnv = env === 'prod' ? 'local' : 'prod'
    setApiEnv(next)
    setEnv(next)
  }

  return (
    <button
      onClick={toggle}
      title={env === 'prod' ? API_URLS.prod : API_URLS.local}
      style={{
        position: 'fixed',
        bottom: 12,
        right: 12,
        zIndex: 9999,
        padding: '4px 10px',
        fontSize: 11,
        fontFamily: 'monospace',
        fontWeight: 600,
        borderRadius: 6,
        border: '1.5px solid',
        cursor: 'pointer',
        opacity: 0.85,
        background: env === 'local' ? '#1a3a1a' : '#2a1a1a',
        color: env === 'local' ? '#4caf50' : '#ef5350',
        borderColor: env === 'local' ? '#4caf50' : '#ef5350',
      }}
    >
      API: {env}
    </button>
  )
}
