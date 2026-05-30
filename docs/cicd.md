# CI/CD Pipeline

## Branch Model

| Branch      | Purpose                                                 |
| ----------- | ------------------------------------------------------- |
| `feature/*` | Development; PRs target `develop`                       |
| `develop`   | Primary development intake; lightweight CI only         |
| `review`    | Intentional review gate; AI review + deep validation    |
| `main`      | Production source; auto-deploys frontend, gates backend |
| `stable`    | Last verified production state; rollback source         |

## Promotion Flow

```text
feature/*
   ↓ PR
develop        (CI: lint, format, type-check, build)
   ↓ promotion PR
review         (Review Gate: CodeRabbit, security scan, dep audit)
   ↓ approved PR
main           (Production Deploy: frontend artifact, backend with approval)
   ↓ smoke tests pass
stable         (Stable Promotion: branch + tag updated)
```

## Workflows

### `ci-develop.yml` — Lightweight CI

- **Triggers**: pushes to `develop`, PRs into `develop`
- **Path-aware**: frontend CI only runs if `frontend/**` changed; backend CI only if `SunriseApi/**` changed
- **Frontend**: lint (zero warnings), format check (Prettier), type-check (tsc), build
- **Backend**: restore, build (Release), tests (skipped if no test projects found)
- **Does NOT run**: CodeRabbit, integration tests, deploys

### `review-gate.yml` — Review Gate

- **Triggers**: PRs from `develop` into `review` only
- **Path-aware**: same frontend/backend filtering
- **Frontend**: full CI + `npm audit --audit-level=high`
- **Backend**: full CI + `dotnet list package --vulnerable`
- **CodeRabbit**: triggered automatically via `.coderabbit.yaml` (base_branches: review)
- **Version sync**: validates both projects build cleanly together

### `production-deploy.yml` — Production Promotion

- **Triggers**: push to `main` only
- **Frontend**: builds with `VITE_BUILD_SHA`, uploads artifact (30-day retention)
- **Backend**: requires manual approval via GitHub Environment `production`, then deploys to Azure
- **Release tag**: `release-YYYY-MM-DD-HHMM` created after successful jobs
- **Netlify**: auto-deploys from `main` (configured in Netlify dashboard)

### `stable-promotion.yml` — Stable Promotion

- **Triggers**: `workflow_run` on `production-deploy` completion (main branch only)
- **Smoke tests**: health check, frontend check, version SHA verification
- **Promotes**: force-pushes `main` HEAD to `stable` branch
- **Tags**: creates `stable-YYYY-MM-DD-HHMM` tag

## Setup Checklist

### GitHub Secrets Required

| Secret              | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `AZURE_CREDENTIALS` | Azure service principal JSON (`az ad sp create-for-rbac`) |

### GitHub Variables Required

| Variable                  | Example                              |
| ------------------------- | ------------------------------------ |
| `AZURE_APP_NAME`          | `sunrise-api`                        |
| `PRODUCTION_API_URL`      | `https://your-api.azurewebsites.net` |
| `PRODUCTION_FRONTEND_URL` | `https://your-app.netlify.app`       |

### GitHub Environment Setup

1. Go to **Settings → Environments → New environment**
2. Name it `production`
3. Add **Required reviewers** (you or your team)
4. This gates the backend deploy step in `production-deploy.yml`

### GitHub Branch Protection Rules

**`develop`**

- Require status checks: `Frontend CI`, `Backend CI`
- Do not require CodeRabbit

**`review`**

- Require status checks: `Frontend Review`, `Backend Review`, `Version Sync Check`
- Require CodeRabbit review (once CodeRabbit app is installed and auto-review is confirmed)

**`main`**

- Require status checks: all passing
- Require at least 1 approved PR review
- No direct pushes

**`stable`**

- No direct pushes (workflow-only updates via `stable-promotion.yml`)
- Enable "Restrict who can push" — allow only GitHub Actions

### Netlify Dashboard Settings

1. **Production branch**: set to `main`
2. **Branch deploys**: enable for `develop` and `review` (for previews)
3. **Deploy previews**: enable for all PRs
4. **Auto-publish**: only for `main` (disable for other branches)

The `netlify.toml` contexts handle per-branch build configuration automatically.

## Rollback Procedure

```bash
# 1. Identify last good state
git log stable --oneline -5

# 2. Redeploy frontend: push stable to main (triggers Netlify redeploy)
git checkout main
git reset --hard stable
git push origin main --force-with-lease

# 3. Redeploy backend: re-run production-deploy workflow on the reset main
# (GitHub Actions → Production Deploy → Re-run jobs)
```

The `stable` branch always represents the last smoke-test-verified production deployment, so rollback requires no rebuilding.

## Version Endpoint

`GET /version` on the backend API returns:

```json
{
  "sha": "abc1234...",
  "version": "main",
  "deployedAt": "2026-05-27T12:00:00Z"
}
```

Set via environment variables on the Azure App Service:

- `BUILD_SHA` — git SHA at deploy time
- `BUILD_VERSION` — branch/tag name
- `DEPLOY_TIMESTAMP` — ISO timestamp of deployment

## Database Migration Strategy

Use expand/migrate/contract for safe zero-downtime deploys:

1. Deploy backward-compatible backend (new columns nullable, old columns still read)
2. Run `dotnet ef database update` (additive migration only)
3. Deploy frontend using new schema
4. Later PR: remove deprecated columns/endpoints

Never deploy a breaking schema change and frontend change in the same deployment.
