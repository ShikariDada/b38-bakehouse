import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3111";

function hiddenCountFn() {
  const els = Array.from(document.querySelectorAll(".rv, .rv-img"));
  return els.filter(el => {
    const r = el.getBoundingClientRect();
    const overlap = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
    if (overlap < Math.min(r.height * 0.5, 200)) return false; // edge-peekers reveal on scroll
    return parseFloat(getComputedStyle(el).opacity) < 0.9;
  }).length;
}

// Regression test for the client-side navigation reveal bug: reveal-animated
// content must be visible after <Link> navigation, not only after a hard reload.
test("client-side navigation reveals all animated content", async ({ page }) => {
  await page.goto(BASE + "/");
  await expect(page.getByRole("heading", { name: /looks like/ })).toBeVisible();

  await page.getByRole("link", { name: "Designs" }).first().click();
  await page.waitForURL(/\/designs/);
  await expect(page.getByRole("heading", { name: /Pick your/ })).toBeVisible();
  await page.waitForTimeout(700);
  expect(await page.evaluate(hiddenCountFn)).toBe(0);

  await page.getByRole("link", { name: /Cocoa Drip Crown/ }).first().click();
  await page.waitForURL(/\/designs\/cocoa-drip-crown/);
  await expect(page.getByRole("heading", { name: /Cocoa Drip Crown/ })).toBeVisible();
  await page.waitForTimeout(700);
  expect(await page.evaluate(hiddenCountFn)).toBe(0);

  await page.getByRole("link", { name: "Custom Cake" }).first().click();
  await page.waitForURL(/\/custom/);
  await expect(page.getByRole("heading", { name: /Start where/i })).toBeVisible();
  await page.waitForTimeout(700);
  expect(await page.evaluate(hiddenCountFn)).toBe(0);
});
