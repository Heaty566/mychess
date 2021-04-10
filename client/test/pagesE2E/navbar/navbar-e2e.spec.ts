import puppeteer, { Page } from 'puppeteer';

import { Browser } from 'puppeteer';
import router from '../../../common/constants/router';

jest.setTimeout(60000);
const url = 'http://localhost:3000';

describe('/auth/login', () => {
    let page: Page;
    let browser: Browser;

    beforeEach(async () => {
        browser = await puppeteer.launch({
            slowMo: 200,
            headless: true,
        });
        page = await browser.newPage();
        await page.goto(url);
    });
    describe('navbar menu link', () => {
        it('GAMES button', async () => {
            const selector = 'a[data-testid=navbarmenu-link-games]';
            await page.waitForSelector(selector);
            await page.click(selector);

            expect(page.url().endsWith(router.home.link)).toBeTruthy();
            await page.close();
        });
        it('COMMUNITY button', async () => {
            const selector = 'a[data-testid=navbarmenu-link-community]';
            await page.waitForSelector(selector);
            await page.click(selector);

            expect(page.url().endsWith(router.community.link)).toBeTruthy();
            await page.close();
        });
        it('ABOUT button', async () => {
            const selector = 'a[data-testid=navbarmenu-link-about]';
            await page.waitForSelector(selector);
            await page.click(selector);

            expect(page.url().endsWith(router.about.link)).toBeTruthy();
            await page.close();
        });
        it('SUPPORT button', async () => {
            const selector = 'a[data-testid=navbarmenu-link-support]';
            await page.waitForSelector(selector);
            await page.click(selector);

            expect(page.url().endsWith(router.support.link)).toBeTruthy();
            await page.close();
        });
    });

    it('link Login button', async () => {
        const selector = 'a[data-testid=navbaruser-login]';
        await page.waitForSelector(selector);
        await page.click(selector);

        expect(page.url().endsWith(router.login.link)).toBeTruthy();
        await page.close();
    });
});
