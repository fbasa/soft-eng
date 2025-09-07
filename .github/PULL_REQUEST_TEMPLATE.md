## Summary
<!-- What, why, how in 2–5 lines -->
- **What:** …
- **Why:** …
- **How:** …

## Linked issues
Closes #____ • Relates to #____

## Screenshots / Demos (before → after)
<!-- Drag images/gifs or paste URLs -->
| Before | After |
|-------|-------|
|       |       |

## Changes
- [ ] UI
- [ ] Logic
- [ ] Build/Config
- [ ] Docs

### Breaking changes?
- [ ] No
- [ ] Yes → **Migration notes:** …

### Feature flags / toggles
- Flag name(s): …
- Default: On / Off

## Test plan
- [ ] Unit tests added/updated (`npm run test`)
- [ ] E2E / manual flows verified
  - [ ] Fresh install (`git clean -xfd && npm ci`)
  - [ ] Local prod build: `ng build --configuration=production`
  - [ ] Routes work (deep link refresh doesn’t 404)

## Quality gates (please run locally or link CI)
- [ ] Lint passes (`npm run lint`)
- [ ] Type checks pass (`npm run type-check` if present)
- [ ] Format checked (`npm run format:check` or Prettier)
- [ ] Build passes (`npm run build` or `ng build`)
- [ ] No secrets or tokens committed
- [ ] Accessible labels/roles for new UI (basic a11y pass)

## GitHub Pages notes (if this affects deploy)
- Project page base-href = `"/<repo>/"` (user/org page or custom domain = `"/"`)
- `404.html` present for SPA routing
- Any changes to `CNAME`?  ☐ No ☐ Yes → details:

## Checklist
- [ ] README/Docs updated (usage, env, scripts)
- [ ] Changelog entry (if you keep one)
- [ ] Code reviewed by owner(s)
