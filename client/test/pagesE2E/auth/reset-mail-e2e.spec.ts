import puppeteer, { Page } from 'puppeteer';

import { Browser } from 'puppeteer';
import router from '../../../common/constants/router';
import { captureScreen } from '../../helper/captureScreen';

import { config, user } from '../init-e2e';
jest.setTimeout(60000);
const url = `${config.url}/auth/reset-mail`;

describe('/auth/reset-mail', () => {
    let page: Page;
    let browser: Browser;

    beforeEach(async () => {
        browser = await puppeteer.launch({
            slowMo: 200,
            headless: false,
        });
        page = await browser.newPage();
        await page.goto(url);
    });

    it('after login return to home page', async () => {
        const incogPage = await (await browser.createIncognitoBrowserContext()).newPage();
        incogPage.goto(url);
        await incogPage.waitForNavigation();
        await incogPage.type('#email', user.email);
        await incogPage.click('button[type=submit]');
        const usernameErrorSelector = '[data-testid=msgsuccess]';
        await page.evaluate(() => {});
        const usernameError = await page.waitForSelector(
            '#__next > div > div.grid.flex-1.shadow-sm.chess-bg.place-items-center.grid-rows-max > div > form > p.text-green-500.text-first-uppercase.fade-in',
            { timeout: 20000, visible: true },
        );

        await captureScreen(page, 'reset-email-success');
        // expect(incogPage.url().endsWith('/')).toBeTruthy();
        // await incogPage.close();
    });
});
