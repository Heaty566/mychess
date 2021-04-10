import puppeteer from 'puppeteer';

interface PageData {
    url: string;
    nameFile: string;
}

const data: Array<PageData> = [
    { url: '/', nameFile: 'home-page' },
    { url: '/auth/login', nameFile: 'login-page' },
    { url: '/auth/register', nameFile: 'register-page' },
    { url: '/auth/reset-mail', nameFile: 'reset-mail-page' },
    { url: '/auth/reset-phone', nameFile: 'reset-phone-page' },
    { url: '/sadjsakcjnksnajcnksa', nameFile: '404-page' },
    { url: '/user/1', nameFile: 'profile-user-page' },
];
(async () => {
    const browser = await puppeteer.launch({ defaultViewport: { width: 1980, height: 1080 } });
    const page = await browser.newPage();

    for (const x of data) {
        await page.goto('http:/localhost:3000' + x.url);
        await page.screenshot({ path: `${__dirname}/screenshots/${x.nameFile}-desktop.png` });
    }
    await browser.close();
})();
(async () => {
    const browser = await puppeteer.launch({ defaultViewport: { width: 375, height: 812 } });
    const page = await browser.newPage();

    for (const x of data) {
        await page.goto('http:/localhost:3000' + x.url);
        await page.screenshot({ path: `${__dirname}/screenshots/${x.nameFile}-mobile.png` });
    }
    await browser.close();
})();
