# RULES.md — Python + FastAPI

## General
- Follow the existing project structure. Do not reorganise files or rename modules without discussion.
- Match the code style already in use (formatting, naming conventions, import order).
- Use type hints on all new functions. Do not remove existing ones.
- No `print()` statements — use the existing logger.
- No commented-out code in committed files.

## Architecture
- Routers handle HTTP only — no business logic.
- Business logic belongs in services, data access in repositories.
- Do not skip layers (e.g. no DB calls inside routers).

## Security
- Never hardcode secrets, tokens, or credentials — use environment variables.
- Never return ORM objects directly from endpoints — use Pydantic response schemas.
- Never interpolate user input into raw SQL — use parameterised queries or the ORM.
- Never log sensitive data (passwords, tokens, PII).

## Error Handling
- Use `HTTPException` for expected client errors (4xx).
- Let unexpected errors bubble up to the global handler — do not swallow exceptions silently.
- Never expose internal details (stack traces, file paths, DB errors) in responses.

## Database
- All schema changes go through migrations (Alembic). Never alter the schema manually.
- Every migration must have a working `downgrade`.

## Testing
- Add or update tests for every change.
- Do not test against production data.

# Coding rules

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
