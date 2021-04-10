import puppeteer, { Page } from 'puppeteer';

import { fakeData } from '../../helper/fakeData';

import { Browser } from 'puppeteer';
import router from '../../../common/constants/router';
import { captureScreen } from '../../helper/captureScreen';

//còn cái này e2e test máy nó nhập tự submit luôn
jest.setTimeout(60000);
const url = 'http://localhost:3000/auth/register';

describe('/auth/register', () => {
    const user = {
        name: 'hello world',
        username: fakeData(10, 'lettersAndNumbersLowerCase'),
        password: '1234567Aa',
        confirmPassword: '1234567Aa',
    };
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

    it('after register return to home page', async () => {
        const incogPage = await (await browser.createIncognitoBrowserContext()).newPage();
        incogPage.goto(url);
        await incogPage.waitForNavigation();
        await incogPage.type('#username', user.username);
        await incogPage.type('#password', user.password);
        await incogPage.type('#name', user.name);
        await incogPage.type('#confirmPassword', user.confirmPassword);
        await incogPage.click('button[type=submit]');

        expect(incogPage.url().endsWith('/')).toBeTruthy();
        await incogPage.close();
    });
    it('register with wrong field and error message', async () => {
        await page.click('button[type=submit]');
        const usernameErrorSelector = '[data-testid=textfield-error-username]';
        const usernameError = await page.waitForSelector(usernameErrorSelector, { visible: true, timeout: 5000 });

        const passwordErrorSelector = '[data-testid=textfield-error-password]';
        const passwordError = await page.waitForSelector(passwordErrorSelector, { visible: true, timeout: 5000 });

        const nameErrorSelector = '[data-testid=textfield-error-name]';
        const nameError = await page.waitForSelector(nameErrorSelector, { visible: true, timeout: 5000 });
        await captureScreen(page, 'user-register-failed');
        expect(usernameError).toBeDefined();
        expect(passwordError).toBeDefined();
        expect(nameError).toBeDefined();
        expect(page.url().endsWith(router.register.link)).toBeTruthy();
        await page.close();
    });

    it('go to login page', async () => {
        const selector = 'a[data-testid=sidelink-link-sign-in-instead]';
        await page.waitForSelector(selector);
        await page.click(selector);

        expect(page.url().endsWith(router.login.link)).toBeTruthy();
        await page.close();
    });
});
