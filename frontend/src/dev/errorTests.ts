import { client } from '@/api/client';
import { ApiError } from '@/services/apiLogger';

interface Expectation {
  status: number;
  code: string;
  messageContains?: string;
}

export interface TestResult {
  name: string;
  passed: boolean;
}

async function runTest(name: string, fn: () => Promise<unknown>, expected: Expectation): Promise<TestResult> {
  try {
    await fn();
    console.error(`❌ ${name} — expected an error but the request succeeded`);
    return { name, passed: false };
  } catch (err) {
    if (!(err instanceof ApiError)) {
      console.error(`❌ ${name} — threw a non-ApiError:`, err);
      return { name, passed: false };
    }

    const checks = [
      {
        label: 'status',
        pass: err.status === expected.status,
        expected: String(expected.status),
        got: String(err.status),
      },
      {
        label: 'code',
        pass: err.code === expected.code,
        expected: expected.code,
        got: err.code,
      },
      ...(expected.messageContains
        ? [{
            label: 'message',
            pass: err.serverMessage.toLowerCase().includes(expected.messageContains.toLowerCase()),
            expected: `contains "${expected.messageContains}"`,
            got: `"${err.serverMessage}"`,
          }]
        : []),
    ];

    const passed = checks.every(c => c.pass);

    if (passed) {
      console.info(`✅ ${name}`);
    } else {
      console.group(`❌ ${name}`);
      for (const c of checks.filter(c => !c.pass)) {
        console.error(`  🔍 ${c.label}: expected ${c.expected} — got ${c.got}`);
      }
      console.groupEnd();
    }

    return { name, passed };
  }
}

export const tests = {
  domainNotFound_updateGoal: () =>
    runTest(
      'domainNotFound_updateGoal',
      () => client.put('/api/goals/999999999', {}),
      { status: 404, code: 'DOMAIN_NOT_FOUND', messageContains: 'not found' },
    ),

  domainNotFound_deleteGoal: () =>
    runTest(
      'domainNotFound_deleteGoal',
      () => client.delete('/api/goals/999999999'),
      { status: 404, code: 'DOMAIN_NOT_FOUND', messageContains: 'not found' },
    ),

  domainNotFound_groupInvite: () =>
    runTest(
      'domainNotFound_groupInvite',
      () => client.post('/api/groups/999999999/invite?requestingUserId=1'),
      { status: 404, code: 'DOMAIN_NOT_FOUND', messageContains: 'not found' },
    ),

  // GroupsController catches this itself and returns NotFound(text) — plain text body,
  // bypasses the exception handler, so code lands as UNKNOWN.
  controllerCaught_invalidToken: () =>
    runTest(
      'controllerCaught_invalidToken',
      () => client.post('/api/groups/join/this-token-does-not-exist', { userId: 1 }),
      { status: 404, code: 'UNKNOWN' },
    ),

  // GroupsController catches this itself and returns Forbid() — empty body,
  // bypasses the exception handler, so code lands as UNKNOWN.
  controllerCaught_forbid: (groupId = 1, nonOwnerUserId = 999999) =>
    runTest(
      'controllerCaught_forbid',
      () => client.delete(`/api/groups/${groupId}?userId=${nonOwnerUserId}`),
      { status: 403, code: 'UNKNOWN' },
    ),

  runAll: async (): Promise<TestResult[]> => {
    const results = await Promise.all([
      tests.domainNotFound_updateGoal(),
      tests.domainNotFound_deleteGoal(),
      tests.domainNotFound_groupInvite(),
      tests.controllerCaught_invalidToken(),
    ]);

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const summaryLog = failed === 0 ? console.info : console.error;
    summaryLog(`${failed === 0 ? '🎉' : '💥'} ${passed}/${results.length} passed${failed > 0 ? `, ${failed} failed` : ''}`);
    if (failed > 0) {
      console.error('🚨 Failed:', results.filter(r => !r.passed).map(r => r.name));
    }
    return results;
  },
};

export function registerErrorTests() {
  (window as Window & { __errorTests?: typeof tests }).__errorTests = tests;
  console.info(
    '[errorTests] Registered at window.__errorTests\n' +
    '  window.__errorTests.runAll()                              — run all auto-testable scenarios\n' +
    '  window.__errorTests.domainNotFound_updateGoal()           — 404 DOMAIN_NOT_FOUND\n' +
    '  window.__errorTests.domainNotFound_deleteGoal()           — 404 DOMAIN_NOT_FOUND\n' +
    '  window.__errorTests.domainNotFound_groupInvite()          — 404 DOMAIN_NOT_FOUND\n' +
    '  window.__errorTests.controllerCaught_invalidToken()       — 404 UNKNOWN (controller bypass)\n' +
    '  window.__errorTests.controllerCaught_forbid(id, uid)      — 403 UNKNOWN (controller bypass)'
  );
}
