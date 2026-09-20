import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3111";

test("browse → configure → order → mock UPI pay → confirmed tracking", async ({ page }) => {
  await page.goto(BASE + "/");
  await expect(page.getByRole("heading", { name: /looks like/ })).toBeVisible();

  await page.goto(BASE + "/designs/cocoa-drip-crown");
  await expect(page.getByText("Cocoa Drip Crown").first()).toBeVisible();

  // pick 500g, a flavour, eggless, a message, a date
  await page.getByRole("button", { name: /500 g/ }).click();
  await page.getByRole("button", { name: /Red Velvet/ }).click();
  await page.getByRole("switch", { name: /Eggless/ }).click();
  await page.fill("#msg", "Test order");
  await page.getByRole("button", { name: /^Sep|Oct|Nov/ }).first().click(); // first free date chip

  const continueBtn = page.getByRole("button", { name: /Continue/ }).last();
  await expect(continueBtn).toBeEnabled({ timeout: 15000 });
  await continueBtn.click();
  await page.waitForURL(/\/checkout\/B38-/);

  // contact
  await page.fill("#name", "Test Customer");
  await page.fill("#phone", "9876543210");
  await page.getByRole("button", { name: "Save details" }).click();
  await page.waitForURL(/\/checkout\/B38-/);

  // pay
  await page.getByRole("button", { name: /Pay .* with UPI/ }).click();
  await page.waitForURL(/\/pay\?/);
  await page.getByRole("button", { name: "GPay" }).click();
  await page.waitForURL(/\/track\//, { timeout: 20000 });
  await expect(page.getByText("Confirmed")).toBeVisible();
});

test("custom brief → submit → tracking link works", async ({ page }) => {
  await page.goto(BASE + "/custom/from-scratch");
  await page.getByRole("button", { name: "Birthday", exact: true }).click();
  const future = new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10);
  await page.fill("#ed", future);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click(); // refs (optional)
  await page.fill("#keep", "blue and gold");
  await page.getByRole("button", { name: "Continue" }).click(); // matters
  await page.getByRole("button", { name: "Continue" }).click(); // size & taste (defaults)
  await page.getByRole("button", { name: "Continue" }).click(); // look (optional)
  await page.getByRole("button", { name: "Continue" }).click(); // words (optional)
  await page.getByRole("button", { name: /₹1,200 – ₹1,800/ }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click(); // pickup default
  await page.fill("#cn", "Test Customer");
  await page.fill("#ph", "9876543210");
  await page.getByRole("button", { name: /Send for a fixed quote/ }).click();
  await page.waitForURL(/\/request\//);
  await expect(page.getByRole("heading", { name: /Your brief is with Chhaya/ })).toBeVisible();
});

test("studio requires passcode", async ({ page }) => {
  await page.goto(BASE + "/studio");
  await page.waitForURL(/\/studio\/login/);
  await page.fill("#pw", "wrong");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Wrong passcode.")).toBeVisible();
  await page.fill("#pw", process.env.STUDIO_PASSWORD || "b38-demo");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/studio$/);
  await expect(page.getByRole("heading", { name: "Due today" })).toBeVisible();
});
