import { useState } from 'react'
import { tests, type TestResult } from '@/dev/errorTests'
import { API_URLS } from '@/api/client'

type Status = 'idle' | 'running' | 'pass' | 'fail'

const CASES: { key: keyof typeof tests; label: string }[] = [
  { key: 'domainNotFound_updateGoal', label: 'Update non-existent goal' },
  { key: 'domainNotFound_deleteGoal', label: 'Delete non-existent goal' },
  { key: 'domainNotFound_groupInvite', label: 'Invite token for missing group' },
  { key: 'controllerCaught_invalidToken', label: 'Join with invalid token (controller bypass)' },
]

export function DevErrorTests() {
  const [statuses, setStatuses] = useState<Record<string, Status>>({})
  const [running, setRunning] = useState(false)

  function applyResult(result: TestResult) {
    setStatuses((prev) => ({ ...prev, [result.name]: result.passed ? 'pass' : 'fail' }))
  }

  function setStatus(key: string, status: Status) {
    setStatuses((prev) => ({ ...prev, [key]: status }))
  }

  async function runOne(key: keyof typeof tests) {
    const fn = tests[key] as () => Promise<TestResult>
    setStatus(key, 'running')
    const result = await fn()
    applyResult(result)
  }

  async function runAll() {
    setRunning(true)
    setStatuses(Object.fromEntries(CASES.map((c) => [c.key, 'running'])))
    const results = await tests.runAll()
    setStatuses(Object.fromEntries(results.map((r) => [r.name, r.passed ? 'pass' : 'fail'])))
    setRunning(false)
  }

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Dev</span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Error Tests</span>
        </div>
        <button onClick={runAll} disabled={running} className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-gray-700 active:bg-gray-800 disabled:opacity-40">
          {running ? '⏳ Running…' : '▶ Run All'}
        </button>
      </div>

      <div className="divide-y divide-gray-50">
        {CASES.map(({ key, label }) => {
          const status = statuses[key] ?? 'idle'
          return (
            <div key={key} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-700">{label}</p>
                <p className="truncate font-mono text-xs text-gray-400">{key}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <StatusBadge status={status} />
                <button onClick={() => runOne(key)} disabled={status === 'running' || running} className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700 disabled:opacity-30">
                  Run
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="space-y-2 border-t border-gray-100 bg-gray-50 px-4 py-3">
        <p className="text-xs text-gray-400">Results also logged to the browser console.</p>
        <div className="flex gap-3">
          <a href={`${API_URLS.local}/swagger`} target="_blank" rel="noreferrer" className="text-xs font-medium text-blue-600 hover:underline">
            🔗 Swagger (local)
          </a>
          <a href={`${API_URLS.prod}/swagger`} target="_blank" rel="noreferrer" className="text-xs font-medium text-blue-600 hover:underline">
            🔗 Swagger (prod)
          </a>
        </div>
      </div>
    </section>
  )
}

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    idle: 'bg-gray-100 text-gray-400',
    running: 'bg-blue-50 text-blue-500',
    pass: 'bg-green-50 text-green-600',
    fail: 'bg-red-50 text-red-600',
  }
  const labels: Record<Status, string> = {
    idle: '— idle',
    running: '⏳ running',
    pass: '✅ pass',
    fail: '❌ fail',
  }
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${styles[status]}`}>{labels[status]}</span>
}
