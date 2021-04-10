import { Page } from 'puppeteer';

export async function captureScreen(page: Page, fileName: string) {
    await page.screenshot({ path: `${__dirname}/../captureScreen/${fileName}.png` });
}
