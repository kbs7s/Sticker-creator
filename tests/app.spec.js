// End-to-end tests for Sticker Creator. Run: npx playwright test
const { test, expect } = require('@playwright/test');

const S = (page, fn, arg) => page.evaluate(fn, arg);

async function open(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('dialog', (d) => d.accept(d.type() === 'prompt' ? 'Test name' : undefined));
  await page.goto('/');
  await page.waitForFunction(() => window.StickerCreator && window.StickerCreator.state && document.querySelector('#stage .editor-label'));
  return errors;
}

test('loads without errors and renders preview @phone', async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator('#sheetPreview .page').first()).toBeVisible();
  expect(await page.locator('#sheetPreview .label').count()).toBeGreaterThan(0);
  const sw = await S(page, () => document.documentElement.scrollWidth);
  expect(sw).toBeLessThanOrEqual(page.viewportSize().width);
  expect(errors).toEqual([]);
});

test('self-hosted fonts load (no Google Fonts)', async ({ page }) => {
  const external = [];
  page.on('request', (r) => { if (!r.url().startsWith('http://localhost')) external.push(r.url()); });
  await open(page);
  const ok = await S(page, async () => { await document.fonts.load("700 20px 'Cairo'", 'مرحبا'); return document.fonts.check("700 20px 'Cairo'", 'مرحبا'); });
  expect(ok).toBe(true);
  expect(external).toEqual([]);
});

test('projects are stored in IndexedDB and survive reload', async ({ page }) => {
  await open(page);
  await page.fill('#projectName', 'IDB project');
  await page.click('[data-act=save]');
  await page.waitForTimeout(300);
  expect(await S(page, () => window.StickerCreator.KV.usingIdb)).toBe(true);
  expect(await S(page, () => localStorage.getItem('stickerCreator.projects'))).toBeNull();
  await page.reload();
  await page.waitForFunction(() => window.StickerCreator && window.StickerCreator.state);
  await page.click('[data-act=projects]');
  await expect(page.locator('#projectList')).toContainText('IDB project');
});

test('variable formatting filters and arithmetic', async ({ page }) => {
  await open(page);
  const r = await S(page, () => {
    const f = window.StickerCreator.fmt;
    const rec = { n: 'D-009', price: '1234.5', name: 'ali hassan', code: '590123412345', empty: '' };
    return [
      f('{n+1}', rec), f('{n+100}', rec), f('{price|0.00}', rec), f('{price|#,##0.00}', rec), f('{name|upper}', rec), f('{name|title}', rec),
      f('{n|ar}', rec), f('{code|ean}', rec), f('{empty|default:—}', rec), f('{name|first:3}', rec), f('{missing}', rec), f('{n|prefix:#}', rec),
    ];
  });
  expect(r).toEqual(['D-010', 'D-109', '1234.50', '1,234.50', 'ALI HASSAN', 'Ali Hassan', 'D-٠٠٩', '5901234123457', '—', 'ali', '{missing}', '#D-009']);
});

test('EAN13 check digit is added automatically and 2D codes render', async ({ page }) => {
  await open(page);
  await page.click('[data-add=barcode]');
  await S(page, () => { const e = window.StickerCreator.state.label.elements.at(-1); e.format = 'EAN13'; e.value = '590123412345'; });
  await page.click('[data-add=text]'); // forces a re-render
  await expect(page.locator('#stage .el-barcode svg').last()).toBeVisible();
  await expect(page.locator('#stage .el-barcode .err')).toHaveCount(0);
  await S(page, () => { const e = window.StickerCreator.state.label.elements.find((x) => x.format === 'EAN13'); e.format = 'DATAMATRIX'; e.value = 'ABC-{n}'; });
  await page.click('[data-add=text]');
  await page.waitForFunction(() => !!window.bwipjs, null, { timeout: 15000 });
  await expect(page.locator('#stage .el-barcode svg path, #stage .el-barcode svg rect').first()).toBeAttached();
});

test('Excel import fills the data table', async ({ page }) => {
  await open(page);
  await page.click('.tab[data-tab=data]');
  await page.click('[data-seg="data.mode"] [data-val=csv]');
  await page.setInputFiles('#csvInput', require('path').join(__dirname, 'fixtures', 'products.xlsx'));
  await expect(page.locator('#csvInfo')).toContainText('3');
  expect(await S(page, () => window.StickerCreator.state.data.csv)).toContain('أحمد');
});

test('curved text, icons and rich text render', async ({ page }) => {
  await open(page);
  await page.click('[data-add=arctext]');
  await expect(page.locator('#stage .el-arctext textPath')).toHaveCount(1);
  await page.click('[data-add=icon]');
  await page.locator('.icon-btn[title=truck]').click();
  await expect(page.locator('#stage .el-icon svg path').first()).toBeAttached();
  await page.click('[data-add=text]');
  await S(page, () => { const e = window.StickerCreator.state.label.elements.at(-1); e.rich = true; e.text = 'Hi **bold** [color=#e00]red[/color]'; });
  await page.click('[data-act=zoomFit]');
  await expect(page.locator('#stage .el-text b')).toHaveText('bold');
});

test('edit a single label from the preview', async ({ page }) => {
  await open(page);
  await page.click('[data-pmode=edit]');
  await page.locator('#sheetPreview .label[data-idx="1"]').click();
  const ta = page.locator('#labelDlgBody textarea').first();
  await ta.fill('Special label');
  await page.locator('#labelDlgBody .btn.accent').click();
  await expect(page.locator('#sheetPreview .label[data-idx="1"]')).toContainText('Special label');
  await expect(page.locator('#sheetPreview .label[data-idx="0"]')).not.toContainText('Special label');
  await expect(page.locator('#editedInfo')).toBeVisible();
});

test('image editor trims and removes background', async ({ page }) => {
  await open(page);
  await page.click('[data-add=image]').catch(() => {});
  // put a red square on white background into the image element
  await S(page, () => {
    const c = document.createElement('canvas'); c.width = 100; c.height = 80;
    const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 100, 80); x.fillStyle = '#f00'; x.fillRect(30, 20, 40, 30);
    const e = window.StickerCreator.state.label.elements.filter((q) => q.type === 'image').at(-1); e.src = c.toDataURL();
  });
  await page.keyboard.press('Escape');
  await page.locator('#imageInput').evaluate((i) => i.dispatchEvent(new Event('cancel')));
  await page.locator('#layers li', { hasText: /صورة|Image/ }).first().click();
  await page.getByRole('button', { name: /✂/ }).click();
  await page.click('[data-img=trim]');
  await expect(page.locator('#imgSize')).toContainText('40 × 30');
  await page.click('[data-img=reset]');
  await page.click('[data-img=removeBg]');
  const alpha = await S(page, () => { const c = document.querySelector('#imgCanvas'); return c.getContext('2d').getImageData(1, 1, 1, 1).data[3]; });
  expect(alpha).toBe(0);
  await page.click('[data-img=apply]');
});

test('save design as user template', async ({ page }) => {
  await open(page);
  await page.click('[data-act=templates]');
  await page.locator('.tpl-bar .btn').click();
  await expect(page.locator('#templateGrid')).toContainText('Test name');
});

test('share link round-trips the design', async ({ page, context }) => {
  await open(page);
  await page.fill('#projectName', 'Shared design');
  await page.click('[data-act=share]');
  await expect(page.locator('#shareUrl')).toHaveValue(/#d=/);
  const url = await page.inputValue('#shareUrl');
  expect(url).toContain('#d=');
  const p2 = await context.newPage();
  p2.on('dialog', (d) => d.accept());
  await p2.goto(url);
  await p2.waitForFunction(() => window.StickerCreator && window.StickerCreator.state && window.StickerCreator.state.name === 'Shared design');
});

test('PDF export downloads an A4 PDF and logs the print', async ({ page }) => {
  await open(page);
  await page.click('header [data-act=print]');
  await page.selectOption('#pngDpi', '150');
  const dl = page.waitForEvent('download', { timeout: 45000 });
  await page.click('[data-act=exportPdf]');
  const d = await dl;
  const buf = require('fs').readFileSync(await d.path());
  expect(buf.slice(0, 5).toString()).toBe('%PDF-');
  expect(buf.toString('latin1')).toMatch(/MediaBox \[0 0 595\.2\d* 841\.8\d*\]/);
  await page.click('#printDlg [data-act=printLog]');
  await expect(page.locator('.log-table tr')).toHaveCount(2);
});

test('guided tour can be opened from the help button', async ({ page }) => {
  await open(page);
  await page.click('[data-act=help]');
  await expect(page.locator('#tour')).toBeVisible();
  for (let i = 0; i < 7; i++) await page.click('[data-tour=next]');
  await expect(page.locator('#tour')).toBeHidden();
});

test('custom font upload registers the font and stores it', async ({ page }) => {
  await open(page);
  await page.click('[data-add=text]');
  const chooser = page.waitForEvent('filechooser');
  await page.locator('#inspector button[title]', { hasText: '＋' }).first().click();
  await (await chooser).setFiles(require('path').join(__dirname, '..', 'fonts', 'amiri-latin-700-normal.woff2'));
  await expect.poll(() => S(page, () => window.StickerCreator.state.label.elements.at(-1).font)).toBe('amiri latin 700 normal');
  expect(await S(page, () => Object.keys(JSON.parse(window.StickerCreator.KV.get('userFonts'))))).toContain('amiri latin 700 normal');
});

test('works offline after the first visit (service worker)', async ({ page, context }) => {
  await open(page);
  await page.waitForFunction(async () => { const r = await navigator.serviceWorker.ready; return !!r.active; }, null, { timeout: 30000 });
  await page.waitForFunction(async () => (await caches.keys()).some((k) => k.startsWith('sticker-creator-')));
  await context.setOffline(true);
  await page.reload();
  await page.waitForFunction(() => window.StickerCreator && document.querySelector('#stage .editor-label'));
  await context.setOffline(false);
});
