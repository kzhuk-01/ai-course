# Legacy Test Analysis — ai.test.maintenance

**Scope:** `pages/PlaywrightDevPage.ts` (nav-related), `tests/main-navigation.spec.ts`  
**Date:** 2026-03-31  
**Reviewer:** AI-Assisted Audit

---

## Prioritized Issue Checklist

### P1 — Critical (False Positives / Broken Coverage)

| #   | File                   | Location        | Issue                                                                               | Category         | Impact                                                                                                                 |
| --- | ---------------------- | --------------- | ----------------------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | `PlaywrightDevPage.ts` | `navLinks.docs` | Uses `page.locator("#docs")` — targets a **section anchor**, not the nav `<a>` link | Selector Quality | `#docs` resolves to the wrong element; assertion confirms an invisible/off-viewport section rather than the nav button |

---

### P2 — High (Flakiness)

| #   | File                   | Location          | Issue                                                                                      | Category         | Impact                                                                                              |
| --- | ---------------------- | ----------------- | ------------------------------------------------------------------------------------------ | ---------------- | --------------------------------------------------------------------------------------------------- |
| 2   | `PlaywrightDevPage.ts` | `navLinks` object | Inconsistent locator strategies: `#docs` (CSS ID) vs `getByRole` for `api` and `community` | Selector Quality | ID-based selectors break on any markup refactor; inconsistency increases audit and maintenance cost |

---

### P3 — Medium (Coverage Gaps / Maintainability)

| #   | File                      | Location                  | Issue                                                                              | Category               | Impact                                                                                                          |
| --- | ------------------------- | ------------------------- | ---------------------------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| 3   | `main-navigation.spec.ts` | `expectNavLinksVisible()` | No **navigation-target assertions** — `href` values are never checked              | Coverage               | A visually present link could point to `"#"` or a 404; no test would catch it                                   |
| 4   | `main-navigation.spec.ts` | Entire file               | Single flat test covers all three nav links — failures cannot be isolated per link | Readability / Coverage | A single failing nav link fails the whole test with no indication of which link broke                           |
| 5   | `main-navigation.spec.ts` | Every `test()`            | `goto()` is called inside each test individually — no `beforeEach` hook            | Duplication Risk       | Repeated navigation setup increases maintenance surface; changing the home URL requires edits in N places       |
| 6   | `main-navigation.spec.ts` | Top-level                 | No `describe()` grouping — tests are flat                                          | Readability / Reuse    | HTML reports group by file only; no semantic grouping; `beforeEach`/`afterEach` cannot be scoped to a sub-suite |

---

### P4 — Low (Accessibility / Edge Cases)

| #   | File                      | Location        | Issue                                                      | Category      | Impact                                                                                                 |
| --- | ------------------------- | --------------- | ---------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| 7   | `PlaywrightDevPage.ts`    | `navLinks.docs` | `#docs` carries no ARIA semantics; `getByRole` is not used | Accessibility | Locator does not verify the element is an accessible, focusable link                                   |
| 8   | `main-navigation.spec.ts` | —               | No `toBeEnabled()` assertion alongside `toBeVisible()`     | Accessibility | A link can be visible but disabled (pointer-events: none, aria-disabled); the test would not catch it  |
| 9   | `main-navigation.spec.ts` | —               | No keyboard-navigation test (`Tab` + `Enter` on nav links) | Accessibility | Keyboard-only users cannot be guaranteed working navigation; WCAG 2.1 criterion 2.1.1                  |
| 10  | `main-navigation.spec.ts` | —               | No test at a mobile viewport (e.g., 375×667)               | Coverage      | Nav may collapse into a hamburger menu; visibility assertions would silently fail or skip the real nav |

---

## Additional Findings (AI-Missed)

### 1. Missing `href` verification on all nav links

**Expected** `navLinks` entries should carry destinations:

| Link      | Expected `href`              |
| --------- | ---------------------------- |
| Docs      | `/docs/intro`                |
| API       | `/docs/api/class-playwright` |
| Community | `/community/welcome`         |

None of the current tests call `toHaveAttribute("href", ...)`, so a typo or dead link goes undetected.

### 2. No `describe` or test isolation — duplication risk

`main-navigation.spec.ts` calls `goto()` unconditionally inside each test. If more tests are added following the same pattern, the navigation setup duplication will grow. A shared `beforeEach` at the `describe` level would prevent this.

### 3. No `afterEach` / cleanup

No `afterEach` closes dialogs, clears storage, or resets page state. While the current tests are stateless, this omission becomes a risk as the suite grows — especially if cookie banners or consent dialogs appear between test runs.

---

## Summary by Category

| Category            | Issue Count                     | Highest Priority |
| ------------------- | ------------------------------- | ---------------- |
| Selector Quality    | 2 (#1, #2)                      | P1               |
| Coverage            | 3 (#3, #4, #10 + additional #1) | P3               |
| Accessibility       | 3 (#7, #8, #9)                  | P4               |
| Readability / Reuse | 2 (#4, #6)                      | P3               |
| Duplication Risk    | 2 (#5 + additional #2)          | P3               |

---

## Recommended Fix Categories (for next chapter)

1. **Replace `#docs` ID selector with `getByRole("link", { name: "Docs" })`** — align with the rest of the `navLinks` object
2. **Add `href` assertions** to each nav link locator method
3. **Wrap tests in `describe` blocks** with a shared `beforeEach(() => playwrightDev.goto())`
4. **Split `expectNavLinksVisible()` into per-link methods** or use `test.each` for isolation
5. **Add `toBeEnabled()` alongside `toBeVisible()`** for all interactive elements
6. **Add a mobile-viewport project or test variant** to cover collapsed nav behavior

No code changes applied in Chapter 2.
