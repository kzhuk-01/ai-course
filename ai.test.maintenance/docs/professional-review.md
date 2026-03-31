# Professional Review — `tests/main-navigation.refactored.spec.ts`

**File reviewed:** `tests/main-navigation.refactored.spec.ts`  
**Supporting POM:** `pages/PlaywrightDevPage.ts`  
**Date:** 2026-03-31  
**Test run status:** ✅ All tests pass (Chromium, exit code 0)

---

## Checklist Results

### 1. Traceability

| Item                               | Status     | Notes                                                                                                                      |
| ---------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| Test names describe the behavior   | ⚠️ Partial | `"button is visible, enabled, and accessible"` — "button" is semantically wrong (it's a `<a>` link); "accessible" is vague |
| Requirement / ticket IDs present   | ❌ Missing | No `TC-NAV-NNN` IDs, no `test.info().annotations`, no tags (`@smoke`, `@navigation`)                                       |
| `describe` block names the feature | ✅ Pass    | `"Main Page – Navigation Buttons"` clearly identifies the scope                                                            |

---

### 2. Coverage

| Item                                       | Status     | Notes                                                           |
| ------------------------------------------ | ---------- | --------------------------------------------------------------- |
| Positive: links visible + enabled          | ✅ Pass    | Covered via `expectNavLinkAccessible()` for all three nav items |
| Positive: correct `href` attribute         | ✅ Pass    | `toHaveAttribute("href", hrefPattern)` in POM L51               |
| Positive: correct navigation URL           | ✅ Pass    | `toHaveURL(urlPattern)` in spec L32                             |
| Destination page content verified          | ❌ Missing | Only URL is checked; a 404 with the right slug would pass       |
| Negative: broken/absent link               | ❌ Missing | No test for missing, disabled, or `href="#"` link               |
| Edge case: `aria-hidden` / `tabindex="-1"` | ❌ Missing | Links invisible to AT would not be caught                       |
| Edge case: unintended `href` target        | ❌ Missing | No guard against `href="/"`, `href="#"`, or external domain     |
| Mobile viewport coverage                   | ❌ Missing | Nav items may collapse on small screens                         |
| Keyboard navigation                        | ❌ Missing | No `Tab` + `Enter` interaction tested                           |

---

### 3. Maintainability — POM, Reuse, Duplication

| Item                                                | Status     | Notes                                                                                                                                                             |
| --------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Locators centralised in POM                         | ⚠️ Partial | Accessibility loop uses `expectNavLinkAccessible()` ✅; navigation loop bypasses POM entirely — `page.getByRole(...).first()` inline (spec L25)                   |
| Single POM instance per test                        | ❌ Issue   | `PlaywrightDevPage` instantiated in `beforeEach` (spec L11–13) **and again** inside each accessibility test body (spec L18) — same `page` object, redundant `new` |
| Guard for unknown nav key                           | ✅ Pass    | Both POM methods (L44–46, L50–52) throw descriptive errors                                                                                                        |
| Dead code removed                                   | ⚠️ Partial | `expectNavLinksVisible()` (POM L37–40) is still present; superseded by `expectNavLinkAccessible()` but retained for `main-navigation.spec.ts` compatibility       |
| `hrefPattern` === `urlPattern` relation unexplained | ⚠️ Note    | For all three items the two patterns are identical — a comment explaining this is intentional would remove ambiguity                                              |

---

### 4. Clarity — Names & Comments

| Item                            | Status     | Notes                                                                                                          |
| ------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------- |
| Loop variable names clear       | ✅ Pass    | `NAV_ITEMS`, `name`, `hrefPattern`, `urlPattern` are self-documenting                                          |
| Test step labels present        | ✅ Pass    | Both `test.step()` calls in navigation loop are labelled                                                       |
| Test names reflect assertions   | ⚠️ Partial | "accessible" should be "has correct href and is interactive"; "button" should be "link"                        |
| Key-mapping contract documented | ❌ Missing | No comment explaining that `name.toLowerCase()` must match the `navLinks` property name — non-obvious contract |

---

### 5. Validation Quality — Assertions

| Item                                 | Status     | Notes                                                                                                                                                        |
| ------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `toBeVisible()`                      | ✅ Pass    | POM L53                                                                                                                                                      |
| `toBeEnabled()`                      | ✅ Pass    | POM L54                                                                                                                                                      |
| `toHaveAttribute("href", ...)`       | ✅ Pass    | POM L55                                                                                                                                                      |
| `toHaveURL(...)`                     | ✅ Pass    | Spec L32                                                                                                                                                     |
| `.first()` used on ambiguous locator | ⚠️ Risk    | Spec L25 — `page.getByRole("link", { name }).first()` silently resolves the first match; if the nav link is the second match an unrelated element is clicked |
| Destination heading asserted         | ❌ Missing | After navigation, only URL is validated                                                                                                                      |

---

### 6. Accessibility / Compliance (WCAG 2.1)

| Item                                   | Status        | Notes                                                                                          |
| -------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------- |
| ARIA `role="link"` implicitly verified | ✅ Pass       | `getByRole("link")` in POM fails if computed role ≠ `link`                                     |
| `aria-hidden="true"` not set           | ❌ Not tested | A link hidden from AT would still be found by `getByRole` in some Playwright versions          |
| `tabindex="-1"` not set                | ❌ Not tested | Keyboard-unreachable links violate SC 2.1.1                                                    |
| `aria-label` accuracy                  | ❌ Not tested | If an `aria-label` overrides visible text, the accessible name diverges from what is displayed |

---

## AI Diff — Summary of Changes Applied

The following improvements were generated and applied during the AI-assisted refactor session (see `docs/refactoring-summary.md` for the version timeline):

| Change                                                                             | File                   | Lines  | Issue resolved                                                               |
| ---------------------------------------------------------------------------------- | ---------------------- | ------ | ---------------------------------------------------------------------------- |
| Fixed `#docs` CSS-ID selector → `getByRole("link", { name: "Docs", exact: true })` | `PlaywrightDevPage.ts` | L14    | Brittle selector targeting the wrong DOM element                             |
| Added `expectNavLinkAccessible(name, hrefPattern)` POM method                      | `PlaywrightDevPage.ts` | L49–56 | Centralised href + visibility + enabled assertions                           |
| Added `clickNavLink(name)` POM method with guard                                   | `PlaywrightDevPage.ts` | L43–47 | Enables POM-based nav clicks; unknown key throws rather than silently no-ops |
| Replaced commented-out assertion + `waitForTimeout(2000)` with `toBeVisible()`     | `PlaywrightDevPage.ts` | L35    | Removed time-based false-positive in "get started" test                      |
| Added `exact: true` to `api` and `community` locators                              | `PlaywrightDevPage.ts` | L15–16 | Prevents partial-text ambiguity                                              |

**Remaining open item from the diff (not yet applied at this checkpoint):**  
The navigation loop in the refactored spec still uses `page.getByRole(...).first()` (F-07, F-14) instead of `playwrightDev.clickNavLink()`. This is the primary outstanding maintainability gap.

---

## Final Notes

### What is solid

- The POM cleanly separates locators from test logic for the accessibility suite.
- All six tests are fully isolated (no shared state between tests).
- Role-based locators provide implicit ARIA contract validation at zero extra cost.
- Guards in POM methods surface configuration errors immediately rather than producing mysterious `undefined` locator failures.

### Highest-priority remaining fixes

1. **Replace `page.getByRole(...).first()` (spec L25) with `playwrightDev.clickNavLink(name)`** — eliminates the last raw locator in the spec body and removes `.first()` ambiguity risk.
2. **Merge the double `new PlaywrightDevPage(page)` into a shared `let playwrightDev` at describe scope** — eliminates redundant instantiation.
3. **Add `expect(page.getByRole("main")).toBeVisible()` after each navigation click** — closes the "404 with matching URL" false-positive gap.
4. **Add TC-NAV tag annotations** — enables traceability in CI reports without changing test logic.

### Recommended next enhancements (lower priority)

- `[TC-NAV-007]` edge case: assert `aria-hidden` and `tabindex` are not set on each link.
- `[TC-NAV-008]` edge case: assert `href` is not `"/"`, `"#"`, or an off-domain absolute URL.
- Mobile viewport block using `test.use({ viewport: { width: 375, height: 667 } })`.
