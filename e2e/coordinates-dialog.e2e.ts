import { expect, test, type Page } from "@playwright/test";

const COORDINATE_LINE = "-0.743643887037151, 0.13182590420533, 12345";

test.beforeEach(async ({ context, page }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
});

test("pastes a copied coordinate line, moves the camera, and closes the dialog", async ({
  page,
}) => {
  await writeClipboard(page, COORDINATE_LINE);
  const dialog = await openCoordinatesDialog(page);

  await expect(dialog.getByText("Точный переход", { exact: true })).toHaveCount(0);
  await dialog.getByRole("button", { name: "Вставить из буфера" }).click();

  await expect(dialog).toBeHidden();

  const reopenedDialog = await openCoordinatesDialog(page);
  await expect(
    reopenedDialog.getByRole("textbox", { name: "Действительная часть · Re" }),
  ).toHaveValue("-0.743643887037151");
  await expect(reopenedDialog.getByRole("textbox", { name: "Мнимая часть · Im" })).toHaveValue(
    "0.13182590420533",
  );
  await expect(reopenedDialog.getByRole("textbox", { name: "Увеличение · Zoom" })).toHaveValue(
    "12345",
  );
});

test("keeps the dialog open and shows an error for an invalid clipboard value", async ({
  page,
}) => {
  await writeClipboard(page, "-0.75, 0.1");
  const dialog = await openCoordinatesDialog(page);

  await dialog.getByRole("button", { name: "Вставить из буфера" }).click();

  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("alert")).toHaveText(
    "Строка должна содержать действительную часть, мнимую часть и увеличение через запятую.",
  );
});

async function openCoordinatesDialog(page: Page) {
  await page.getByRole("button", { name: "Открыть точные координаты и масштаб" }).first().click();
  const dialog = page.getByRole("dialog", { name: "Координаты и масштаб" });
  await expect(dialog).toBeVisible();
  return dialog;
}

async function writeClipboard(page: Page, value: string): Promise<void> {
  await page.evaluate((clipboardValue) => navigator.clipboard.writeText(clipboardValue), value);
}
