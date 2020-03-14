const puppeteer = require('puppeteer');

(async () => {

  let browser = await puppeteer.launch({
      dumpio: true,
      headless: true,
      args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
      ]
  });

  console.log('browser starting');
  const page = await browser.newPage();
  console.log('browser started');
  await page.goto('https://target.com/', {waitUntil:'domcontentloaded'});
  console.log('page connected');
  await page.waitFor(5000);
  await page.screenshot({path: require('path').resolve(__dirname, 'example.png')});
  console.log('page saved');
  await browser.close();

})();
