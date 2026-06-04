# Codex Progress Log

## Current Verified State

- Repository root: `/Users/mostafa/Downloads/Coding_Projects/onyx - stcs/onyx`
- Standard setup path:
  - `uv sync --frozen`
  - `cd web && bun install --frozen-lockfile`
- Standard verification path:
  - `uv run --no-sync ty check`
  - `cd web && bun run types:check`
  - Focused tests for changed areas
- Current highest-priority unfinished feature: `stc-local-ui`
- Current blocker: None.

## Session Log

### Session 001

- Date: 2026-06-04
- Goal: Add the core Codex harness artifacts without adding `init.sh`.
- Completed: Added root harness workflow instructions, `codex-progress.md`, and `feature_list.json`.
- Verification run:
  - `python3 -m json.tool feature_list.json`
  - `rg -n "codex-progress" AGENTS.md codex-progress.md feature_list.json`
  - Legacy progress filename reference check
  - `test ! -e init.sh`
  - Skipped progress-file absence check
  - `git diff --check`
  - `git status --short --untracked-files=all docs/architecture`
- Evidence captured:
  - JSON validation exited 0.
  - `AGENTS.md` references `codex-progress.md`.
  - No legacy progress filename references were found in the harness files.
  - No `init.sh` file exists.
  - No skipped progress file exists.
  - `git diff --check` exited 0.
  - Existing `docs/architecture/solution-architecture.html` remained untracked and untouched.
- Commits: `Add core Codex harness artifacts`
- Files or artifacts updated:
  - `AGENTS.md`
  - `codex-progress.md`
  - `feature_list.json`
- Known risk or unresolved issue: Existing untracked `docs/architecture/solution-architecture.html` is unrelated and should remain untouched.
- Next best step: Use `stc-local-ui` as the next active harness-tracked work item when changing STC frontend behavior.
