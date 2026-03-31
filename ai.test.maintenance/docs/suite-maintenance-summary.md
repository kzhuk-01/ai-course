# Suite Maintenance Summary

**Scope:** `ai.test.maintenance/tests/` (5 spec files)  
**Date:** 2026-03-31  
**Reviewer:** AI-Assisted Audit

---

## File Inventory

| File                                   | Tests | Status              | Notes                                                                     |
| -------------------------------------- | ----- | ------------------- | ------------------------------------------------------------------------- |
| `nav.spec.ts`                          | 1     | ❌ Delete           | Exact duplicate of `main-navigation.spec.ts`                              |
| `main-navigation.spec.ts`              | 1     | ❌ Delete           | Duplicate; covered by professional spec                                   |
| `main-navigation.refactored.spec.ts`   | 6     | ⚠️ Obsolete         | Intermediate version superseded by professional spec; 2 unresolved issues |
| `main.navigation.professional.spec.ts` | 8     | ✅ Keep (canonical) | TC IDs, POM-only, edge cases, ARIA + href guards                          |
| `playwright-dev.spec.ts`               | 2     | ✅ Keep             | Separate concern (title + get-started flow)                               |

---

## Findings

### 1. Exact Duplication — `nav.spec.ts` ↔ `main-navigation.spec.ts`

Both files are **byte-for-byte identical**: one test, same import, same POM call. Running both doubles CI time for zero additional coverage.

```
nav.spec.ts:4          "main page should display navigation buttons: Docs, API, Community"
main-navigation.spec.ts:4  "main page should display navigation buttons: Docs, API, Community"
```

**Action:** Delete `nav.spec.ts`. `main-navigation.spec.ts` will also be deleted as part of consolidation (see §3).

---

### 2. Obsolete `expectNavLinksVisible()` usage

Both duplicated files call `playwrightDev.expectNavLinksVisible()` — a method that only checks `toBeVisible()`. This is a strict subset of `expectNavLinkAccessible()` (visible + enabled + href). The richer check already runs via `main.navigation.professional.spec.ts`.

**Impact:** Keeps a dead POM method alive; adds noise to the test run.

---

### 3. Intermediate Spec Superseded — `main-navigation.refactored.spec.ts`

This file is the pre-review checkpoint. `main.navigation.professional.spec.ts` resolves every issue it has, plus adds TC IDs and two edge-case tests. Retaining both causes:

- **Test duplication:** 6 of its 6 tests overlap with TC-NAV-001..006 in the professional spec.
- **Two unresolved issues remain in the refactored spec:**

| Issue       | Location | Description                                                                                                                                                                                                         |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F-10        | L13–14   | `PlaywrightDevPage` instantiated in `beforeEach` (local const, not shared) **and again** inside each accessibility test body — `page` fixture is passed to test callback but used only for the redundant `new` call |
| F-07 + F-14 | L27      | Navigation loop uses `page.getByRole(...).first()` inline instead of `playwrightDev.clickNavLink()` — bypasses POM, `.first()` may resolve to wrong element                                                         |

---

### 4. No Navigation-Target Assertion in Refactored Spec

`main-navigation.refactored.spec.ts` navigation tests assert URL only. A page that redirects to a matching URL but renders a 404 body would pass silently. The professional spec adds `expect(page.getByRole("main")).toBeVisible()` to close this gap.

---

## Consolidation Plan

```
BEFORE (5 files, 18 tests, 4 overlapping scenarios):

  nav.spec.ts                          1 test  ──┐ duplicates
  main-navigation.spec.ts              1 test  ──┘
  main-navigation.refactored.spec.ts   6 tests ──── superseded
  main.navigation.professional.spec.ts 8 tests ──── canonical
  playwright-dev.spec.ts               2 tests ──── unrelated, keep

AFTER (2 files, 10 tests, zero overlap):

  main.navigation.professional.spec.ts 8 tests  (nav suite, canonical)
  playwright-dev.spec.ts               2 tests  (title + get-started)
```

**Steps:**

1. Delete `nav.spec.ts`
2. Delete `main-navigation.spec.ts`
3. Delete `main-navigation.refactored.spec.ts`
4. Remove `expectNavLinksVisible()` from `pages/PlaywrightDevPage.ts` (no remaining callers)

---

## Representative Diff — `main-navigation.refactored.spec.ts`

Shows the two issues (F-10, F-07/F-14) that would need fixing before the refactored spec could be retained. Included for documentation; the recommended action is deletion in favour of the professional spec.

```diff
--- a/tests/main-navigation.refactored.spec.ts
+++ b/tests/main-navigation.refactored.spec.ts
@@ -9,22 +9,22 @@ const NAV_ITEMS = [

 test.describe("Main Page – Navigation Buttons", () => {
-  test.beforeEach(async ({ page }) => {
-    const playwrightDev = new PlaywrightDevPage(page);
-    await playwrightDev.goto();
+  // F-10: share instance so accessibility tests don't re-instantiate
+  let playwrightDev: PlaywrightDevPage;
+
+  test.beforeEach(async ({ page }) => {
+    playwrightDev = new PlaywrightDevPage(page);
+    await playwrightDev.goto();
   });

   for (const { name, hrefPattern } of NAV_ITEMS) {
-    test(`"${name}" button is visible, enabled, and accessible`, async ({ page }) => {
-      const playwrightDev = new PlaywrightDevPage(page);   // F-10: redundant
+    test(`"${name}" button is visible, enabled, and accessible`, async () => {
       await playwrightDev.expectNavLinkAccessible(name, hrefPattern);
     });
   }

   for (const { name, urlPattern } of NAV_ITEMS) {
     test(`"${name}" button navigates to the correct page`, async ({ page }) => {
-      // F-07/F-14: inline locator bypasses POM; .first() resolves ambiguously
-      const link = page.getByRole("link", { name, exact: true }).first();
-      await test.step(`click the "${name}" link`, async () => {
-        await link.click();
+      await test.step(`click the "${name}" nav link`, async () => {
+        await playwrightDev.clickNavLink(name);    // POM method, no .first()
       });
       await test.step("URL matches the expected destination", async () => {
         await expect(page).toHaveURL(urlPattern);
       });
+      await test.step("destination page has main content (not a 404)", async () => {
+        await expect(page.getByRole("main")).toBeVisible();
+      });
     });
   }
 });
```

---

## Action Checklist

- [ ] **Delete** `tests/nav.spec.ts`
- [ ] **Delete** `tests/main-navigation.spec.ts`
- [ ] **Delete** `tests/main-navigation.refactored.spec.ts`
- [ ] **Remove** `expectNavLinksVisible()` from `pages/PlaywrightDevPage.ts` (no callers remain)
- [ ] **Verify** `npx playwright test --project=chromium` passes with 10 tests across 2 files
