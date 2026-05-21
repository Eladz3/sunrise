import { useState } from 'react';
import { tests, type TestResult } from '@/dev/errorTests';
import { API_URLS } from '@/api/client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Status = 'idle' | 'running' | 'pass' | 'fail';

const CASES: { key: keyof typeof tests; label: string }[] = [
  { key: 'domainNotFound_updateGoal',     label: 'Update non-existent goal' },
  { key: 'domainNotFound_deleteGoal',     label: 'Delete non-existent goal' },
  { key: 'domainNotFound_groupInvite',    label: 'Invite token for missing group' },
  { key: 'controllerCaught_invalidToken', label: 'Join with invalid token (controller bypass)' },
];

// ---------------------------------------------------------------------------
// DevPanel
// ---------------------------------------------------------------------------

export function DevPanel() {
  return (
    <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Developer Tools</span>
      </div>

      <ErrorTestsSection />

      <div className="border-t border-gray-100" />

      <ApiSection />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Error Tests sub-section
// ---------------------------------------------------------------------------

function ErrorTestsSection() {
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [running, setRunning] = useState(false);

  function applyResult(result: TestResult) {
    setStatuses(prev => ({ ...prev, [result.name]: result.passed ? 'pass' : 'fail' }));
  }

  function setStatus(key: string, status: Status) {
    setStatuses(prev => ({ ...prev, [key]: status }));
  }

  async function runOne(key: keyof typeof tests) {
    const fn = tests[key] as () => Promise<TestResult>;
    setStatus(key, 'running');
    const result = await fn();
    applyResult(result);
  }

  async function runAll() {
    setRunning(true);
    setStatuses(Object.fromEntries(CASES.map(c => [c.key, 'running'])));
    const results = await tests.runAll();
    setStatuses(Object.fromEntries(results.map(r => [r.name, r.passed ? 'pass' : 'fail'])));
    setRunning(false);
  }

  return (
    <div>
      <div className="px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500">Error Tests</span>
        <button
          onClick={runAll}
          disabled={running}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 active:bg-gray-800 disabled:opacity-40 transition-colors"
        >
          {running ? '⏳ Running…' : '▶ Run All'}
        </button>
      </div>

      <div className="divide-y divide-gray-50">
        {CASES.map(({ key, label }) => {
          const status = statuses[key] ?? 'idle';
          return (
            <div key={key} className="px-4 py-2.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-gray-700 font-medium truncate">{label}</p>
                <p className="text-xs text-gray-400 font-mono truncate">{key}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={status} />
                <button
                  onClick={() => runOne(key)}
                  disabled={status === 'running' || running}
                  className="text-xs px-2 py-1 rounded-md border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
                >
                  Run
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="px-4 py-2 text-xs text-gray-400">Results also logged to the browser console.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// API sub-section
// ---------------------------------------------------------------------------

function ApiSection() {
  return (
    <div className="px-4 py-3 space-y-2">
      <span className="text-xs font-semibold text-gray-500">API</span>
      <div>
        <a
          href={`${API_URLS.local}/swagger`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#85ea2d] hover:bg-[#85ea2d]/10 transition-colors"
        >
          <SwaggerIcon />
          <span className="text-sm font-semibold text-[#4a8218]">Swagger UI</span>
          <span className="text-xs text-gray-400 font-mono">local</span>
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    idle:    'bg-gray-100 text-gray-400',
    running: 'bg-blue-50 text-blue-500',
    pass:    'bg-green-50 text-green-600',
    fail:    'bg-red-50 text-red-600',
  };
  const labels: Record<Status, string> = {
    idle:    '— idle',
    running: '⏳ running',
    pass:    '✅ pass',
    fail:    '❌ fail',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function SwaggerIcon() {
  return (
    <svg width="22" height="18" viewBox="10 22 75 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M31.8 33.854c-.154 1.712.058 3.482-.057 5.213a43 43 0 0 1-.693 5.156 9.53 9.53 0 0 1-4.1 5.829c4.079 2.654 4.54 6.771 4.81 10.946.135 2.25.077 4.52.308 6.752.173 1.731.846 2.174 2.636 2.231.73.02 1.48 0 2.327 0v5.349c-5.29.9-9.657-.6-10.734-5.079a31 31 0 0 1-.654-5c-.117-1.789.076-3.578-.058-5.367-.386-4.906-1.02-6.56-5.713-6.791v-6.1a9 9 0 0 1 1.028-.173c2.577-.135 3.674-.924 4.231-3.463a29 29 0 0 0 .481-4.329 82 82 0 0 1 .6-8.406c.673-3.982 3.136-5.906 7.234-6.137 1.154-.057 2.327 0 3.655 0v5.464c-.558.038-1.039.115-1.539.115-3.336-.115-3.51 1.02-3.762 3.79m6.406 12.658h-.077a3.515 3.515 0 1 0-.346 7.021h.231a3.46 3.46 0 0 0 3.655-3.251v-.192a3.523 3.523 0 0 0-3.461-3.578Zm12.062 0a3.373 3.373 0 0 0-3.482 3.251 2 2 0 0 0 .02.327 3.3 3.3 0 0 0 3.578 3.443 3.263 3.263 0 0 0 3.443-3.558 3.308 3.308 0 0 0-3.557-3.463Zm12.351 0a3.59 3.59 0 0 0-3.655 3.482 3.53 3.53 0 0 0 3.536 3.539h.039c1.769.309 3.559-1.4 3.674-3.462a3.57 3.57 0 0 0-3.6-3.559Zm16.948.288c-2.232-.1-3.348-.846-3.9-2.962a21.5 21.5 0 0 1-.635-4.136c-.154-2.578-.135-5.175-.308-7.753-.4-6.117-4.828-8.252-11.254-7.195v5.31c1.019 0 1.808 0 2.6.019 1.366.019 2.4.539 2.539 2.059.135 1.385.135 2.789.27 4.193.269 2.79.422 5.618.9 8.369a8.72 8.72 0 0 0 3.921 5.348c-3.4 2.289-4.406 5.559-4.578 9.234-.1 2.52-.154 5.059-.289 7.6-.115 2.308-.923 3.058-3.251 3.116-.654.019-1.289.077-2.019.115v5.445c1.365 0 2.616.077 3.866 0 3.886-.231 6.233-2.117 7-5.887A49 49 0 0 0 75 63.4c.135-1.923.116-3.866.308-5.771.289-2.982 1.655-4.213 4.636-4.4a4 4 0 0 0 .828-.192v-6.1c-.5-.058-.843-.115-1.208-.135Z"
        fill="#85ea2d"
      />
    </svg>
  );
}
