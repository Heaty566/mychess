import puppeteer, { Page } from 'puppeteer';

import { Browser } from 'puppeteer';
import router from '../../../common/constants/router';
import { captureScreen } from '../../helper/captureScreen';
import { config, user } from '../init-e2e';

const url = `${config.url}/auth/login`;
jest.setTimeout(60000);
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

    it('after login return to home page', async () => {
        const incogPage = await (await browser.createIncognitoBrowserContext()).newPage();
        incogPage.goto(url);
        await incogPage.waitForNavigation();
        await incogPage.type('#username', user.username);
        await incogPage.type('#password', user.password);
        await incogPage.click('button[type=submit]');

        expect(incogPage.url().endsWith('/')).toBeTruthy();
        await incogPage.close();
    });
    it('login with wrong field and error message', async () => {
        await page.click('button[type=submit]');
        const usernameErrorSelector = '[data-testid=textfield-error-username]';
        const usernameError = await page.waitForSelector(usernameErrorSelector, { visible: true, timeout: 5000 });

        const passwordErrorSelector = '[data-testid=textfield-error-password]';
        const passwordError = await page.waitForSelector(passwordErrorSelector, { visible: true, timeout: 5000 });
        await captureScreen(page, 'user-login-failed');
        expect(usernameError).toBeDefined();
        expect(passwordError).toBeDefined();
        expect(page.url().endsWith(router.login.link)).toBeTruthy();
        await page.close();
    });

    it('go to register page', async () => {
        const selector = 'a[data-testid=sidelink-link-sign-up-instead]';
        await page.waitForSelector(selector);
        await page.click(selector);

        expect(page.url().endsWith(router.register.link)).toBeTruthy();
        await page.close();
    });
    it('go to forgot your password', async () => {
        const selector = 'a[data-testid=sidelink-link-forgot-your-password]';

        await page.waitForSelector(selector);
        await page.click(selector);

        expect(page.url().endsWith(router.forgotPasswordEmail.link)).toBeTruthy();
        await page.close();
    });
});
